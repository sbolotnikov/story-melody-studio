'use client';
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const auth = useAuth();
  const router = useRouter();

  if (!auth) {
    return null;
  }

  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } = auth;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (isReset) {
        await resetPassword(email);
        setResetSent(true);
      } else if (isLogin) {
        await signInWithEmail(email, password);
        router.push("/dashboard");
      } else {
        await signUpWithEmail(email, password);
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg((err as Error).message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMsg((err as Error).message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="grow flex items-center justify-center py-24 px-4 bg-background">
      <div className="w-full max-w-md border border-border bg-muted p-8 shadow-2xl relative">
        <h1 className="text-3xl font-serif font-bold mb-2 text-center text-foreground">
          {isReset ? "Reset Password" : isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-sm text-muted-fg text-center mb-8">
          {isReset 
            ? "Enter your email to receive a reset link." 
            : isLogin 
              ? "Sign in to access your orders and creations." 
              : "Sign up to track your personalized gifts."}
        </p>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <span className="text-xs font-semibold text-red-500 uppercase tracking-widest">{errorMsg}</span>
          </div>
        )}

        {resetSent && isReset ? (
          <div className="text-center p-6 border border-brand-gold bg-brand-gold/10 mb-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">Reset link sent to {email}</p>
            <button 
              type="button" 
              onClick={() => { setIsReset(false); setIsLogin(true); setErrorMsg(""); }}
              className="mt-4 text-xs font-semibold uppercase tracking-widest text-foreground hover:text-brand-gold transition-colors"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">Email Directory</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-border p-4 pl-12 text-sm text-foreground focus:outline-none focus:border-brand-gold transition-colors"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {!isReset && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg">Security Key</label>
                    {isLogin && (
                      <button 
                        type="button" 
                        onClick={() => { setIsReset(true); setErrorMsg(""); }}
                        className="text-[10px] uppercase tracking-widest font-semibold text-brand-gold hover:text-brand-gold/80 transition-colors"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-background border border-border p-4 pl-12 text-sm text-foreground focus:outline-none focus:border-brand-gold transition-colors"
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-gold text-brand-dark px-6 py-4 text-xs font-semibold uppercase tracking-widest hover:bg-brand-gold/90 transition-colors disabled:opacity-50 mt-4"
              >
                {loading ? "Processing..." : isReset ? "Send Reset Link" : isLogin ? "Sign In" : "Sign Up"}
              </button>
            </form>

            {!isReset && (
              <>
                <div className="relative my-8 border-t border-border">
                  <span className="absolute left-1/2 -top-3 -translate-x-1/2 bg-background px-4 text-[10px] uppercase tracking-widest text-muted-fg font-semibold">
                    Or continue with
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full border border-border bg-background px-6 py-4 text-xs font-semibold uppercase tracking-widest text-foreground hover:border-brand-gold hover:text-brand-gold transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
              </>
            )}

            <div className="mt-8 text-center">
              {isReset ? (
                <button 
                  type="button" 
                  onClick={() => { setIsReset(false); setErrorMsg(""); }}
                  className="text-[10px] uppercase tracking-widest font-semibold text-muted-fg hover:text-brand-gold transition-colors"
                >
                  Return to login
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); }}
                  className="text-[10px] uppercase tracking-widest font-semibold text-muted-fg hover:text-brand-gold transition-colors"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
