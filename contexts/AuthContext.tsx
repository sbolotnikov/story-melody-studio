'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface UserProfile {
  id: string; // MongoDB ObjectId
  email: string;
  role: 'user' | 'admin';
  name?: string;
  image?: string;
  phone?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status, update: updateSession } = useSession();
  const sessionUser = session?.user as UserProfile | undefined;
  const [profile, setProfile] = useState<UserProfile | null>(() => sessionUser ?? null);
  const loading = status === 'loading';

  const currentProfile = sessionUser && profile?.id === sessionUser.id
    ? profile
    : sessionUser ?? null;

  // Refresh session after OAuth sign-in so server-side session callback has a chance to populate DB-derived fields (id, role, etc.)
  React.useEffect(() => {
    try {
      if (status === 'authenticated' && sessionUser && !sessionUser.id) {
        updateSession?.().catch((err) =>
          console.error('Failed to refresh session', err),
        );
      }
    } catch (err) {
      console.error('Error checking session refresh', err);
    }
  }, [status, sessionUser, updateSession]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!session?.user) return;
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, email: session.user.email })
      });
      
      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        await updateSession(); // Refresh session data
      }
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const signInWithGoogle = async () => {
    // Redirect-based OAuth; session will be updated after callback. Rely on session sync effect to set profile.
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password: pass,
    });
    if (result?.error) {
      throw new Error(result.error);
    }

    // Force session refresh so useSession gets the latest user fields, then sync effect will set profile.
    try {
      await updateSession?.();
    } catch (err) {
      console.error('Failed to update session after credentials sign-in', err);
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    // We need a register API for this
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to sign up");
    }
    
    // After signup, sign in automatically
    await signInWithEmail(email, pass);
  };

  const resetPassword = async (email: string) => {
    // NextAuth doesn't handle password resets directly.
    // Usually you'd send an email with a token to a reset page.
    console.log("Password reset requested for:", email);
    alert("Password reset functionality needs to be implemented on the backend.");
  };

  const logout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <AuthContext.Provider value={{ 
      user: currentProfile,
      profile,
      loading, 
      signInWithGoogle, 
      signInWithEmail, 
      signUpWithEmail, 
      resetPassword, 
      updateProfile, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
