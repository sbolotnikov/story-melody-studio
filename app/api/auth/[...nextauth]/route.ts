import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: (user as User).role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Diagnostic log: show incoming user and token state (no secrets)
      try {
        console.log('NextAuth jwt callback - user present?', !!user, 'token id?', token?.id);
      } catch (e) { /* ignore logging errors */ }

      if (user) {
        token.id = (user as User).id;
        token.role = (user as User).role;
        token.name = (user as any).name ?? token.name;
        token.email = (user as any).email ?? token.email;
        token.image = (user as any).image ?? token.image;
        token.phone = (user as any).phone ?? token.phone;
      } else if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } });
          if (dbUser) {
            token.role = (dbUser as User).role;
            token.name = dbUser.name ?? token.name;
            token.email = dbUser.email ?? token.email;
            token.image = dbUser.image ?? token.image;
            token.phone = (dbUser as any).phone ?? token.phone;
          }
        } catch (err) {
          console.error('Error fetching user in jwt callback', err);
        }
      }
      try { console.log('NextAuth jwt callback - result token keys:', Object.keys(token || {})); } catch (e) {}
      return token;
    },
    async session({ session, token }) {
      try {
        console.log('NextAuth session callback - token keys:', Object.keys(token || {}));
      } catch (e) {}

      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).name = token.name ?? session.user.name;
        (session.user as any).email = token.email ?? session.user.email;
        (session.user as any).image = token.image ?? session.user.image;
        (session.user as any).phone = (token as any).phone ?? (session.user as any).phone;

        // Fallback: fetch from DB if some fields are still missing
        if (token.id && (!session.user.name || !session.user.image || !session.user.email || !(session.user as any).phone)) {
          try {
            const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } });
            if (dbUser) {
              (session.user as any).name = dbUser.name ?? session.user.name;
              (session.user as any).email = dbUser.email ?? session.user.email;
              (session.user as any).image = dbUser.image ?? session.user.image;
              (session.user as any).phone = (dbUser as any).phone ?? (session.user as any).phone;
              console.log('NextAuth session callback - populated from DB for user', token.id);
            }
          } catch (err) {
            console.error('Error fetching user in session callback', err);
          }
        }
      }
      try { console.log('NextAuth session callback - session.user keys:', Object.keys(session.user || {})); } catch (e) {}
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
