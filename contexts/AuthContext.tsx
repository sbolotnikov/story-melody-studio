'use client';
import React, { createContext, useContext, useState, useRef } from 'react';
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
  updateUserPassword: (newPassword: string, currentPassword?: string) => Promise<boolean | void>;
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

  // Keep profile in sync with server-side user record after authentication.
  // Avoid repeated refresh loops by tracking the last-synced user id and
  // only calling updateSession once if necessary.
  const syncedUserId = useRef<string | null>(null);
  const calledUpdateSession = useRef(false);

  React.useEffect(() => {
    let cancelled = false;

    const syncProfile = async () => {
      try {
        if (status !== 'authenticated' || !sessionUser) return;

        const id = (sessionUser as UserProfile)?.id as string | undefined;

        // If we've already synced for this user id, do nothing.
        if (id && syncedUserId.current === id) return;

        // If we have an id, fetch authoritative user record and stop.
        if (id) {
          try {
            const res = await fetch(`/api/users/${id}`);
            if (res.ok) {
              const data = await res.json();
              if (!cancelled) {
                setProfile(data);
                syncedUserId.current = id;
              }
              return;
            }
          } catch (e) {
            console.warn('Failed to fetch user by id', e);
          }
        }

        // No id available yet: try updateSession once to populate token fields,
        // but avoid calling it repeatedly which can trigger loops.
        if (!id && !calledUpdateSession.current) {
          calledUpdateSession.current = true;
          try {
            await updateSession?.();
          } catch (e) {
            console.warn('updateSession failed:', e);
          }
          // Return and wait for the next effect invocation which may have id populated.
          return;
        }

        // Fallback: set profile from sessionUser and mark as synced to avoid repeats.
        if (!cancelled) {
          setProfile(sessionUser);
          syncedUserId.current = id ?? 'no-id';
        }
      } catch (err) {
        console.error('Error syncing profile', err);
      }
    };

    void syncProfile();

    return () => {
      cancelled = true;
    };
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
  const updateUserPassword = async (newPassword: string, currentPassword?: string) => {
    if (!session?.user) return;
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, currentPassword: currentPassword || undefined, newPassword })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || err?.message || 'Failed to update password');
      }
      // Force session refresh in case session fields changed
      await updateSession?.();
      return true;
    } catch (err) {
      console.error('Failed to update password', err);
      throw err;
    }
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
      updateUserPassword, 
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
