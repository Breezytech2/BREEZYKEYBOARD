/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AndroidMockup } from "./components/AndroidMockup";
import { UserProfile } from "./types";
import { DEFAULT_PROFILE } from "./data";
import { 
  auth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  db,
  signInAnonymously,
  sendPasswordResetEmail,
  sendEmailVerification,
  dbContainer,
  defaultDb
} from "./lib/firebase";
import { doc, onSnapshot, setDoc, getDoc, getDocFromServer } from "firebase/firestore";
import { setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import {
  Sparkles,
  Cpu,
  ShieldCheck,
  Globe,
  Info,
  User,
  Lock,
  Mail,
  UserCheck,
  XCircle,
  AlertCircle,
  LogOut
} from "lucide-react";

export default function App() {
  // Global Applet States
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [apiKeyStatus, setApiKeyStatus] = useState<"checking" | "online" | "offline">("checking");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    console.log("Current Firebase project ID:", auth.app.options.projectId);
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      console.log("Authentication status:", u ? `Logged in as ${u.uid}` : "Not logged in");
    });
    
    getDocFromServer(doc(db, "test", "connection")).then(() => {
      console.log("Firestore connection status: Connected");
    }).catch((err) => {
      if (err.message && err.message.includes("offline")) {
        console.log("Firestore connection status: Offline");
      } else if (err.code === "permission-denied") {
        console.log("Firestore connection status: Connected (Permission Denied for test doc)");
      } else {
        console.log("Firestore connection status: Error", err.message);
      }
    });
    
    return () => unsubscribe();
  }, []);

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Email verification tracking states and helpers
  const [verifying, setVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleCheckVerification = async () => {
    setVerifying(true);
    setVerificationError(null);
    setVerificationSuccess(null);
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        const updatedUser = auth.currentUser;
        if (updatedUser.emailVerified) {
          setUser({ ...updatedUser }); // Trigger state update
          setVerificationSuccess("Email verified successfully! Loading your dashboard...");
        } else {
          setVerificationError("Verification is still pending. Please click the link in your email and try again.");
        }
      }
    } catch (err: any) {
      console.error("Error checking verification:", err);
      setVerificationError("Failed to check status: " + (err.message || err));
    } finally {
      setVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    setVerificationError(null);
    setVerificationSuccess(null);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setVerificationSuccess("A fresh verification link has been sent to your email inbox.");
        setResendCooldown(30); // 30 seconds cooldown
      }
    } catch (err: any) {
      console.error("Error resending verification:", err);
      setVerificationError(err.message || "Failed to resend verification email.");
    }
  };

  // Self-healing Firestore DB check on startup
  useEffect(() => {
    const checkDbAndFallback = async () => {
      try {
        const testRef = doc(dbContainer.activeDb, "users", "connection-probe-temp");
        await getDoc(testRef);
        console.log("Firestore initialized successfully on custom database.");
      } catch (err: any) {
        if (err?.message?.includes("not found") || err?.message?.includes("database") || err?.code === "not-found") {
          console.warn("Custom Firestore DB not found, falling back to default database:", err.message);
          dbContainer.activeDb = defaultDb;
        } else {
          console.log("Connection probe completed. (Offline or permission restriction might apply, which is fine)", err.message);
        }
      }
    };
    checkDbAndFallback();
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(DEFAULT_PROFILE);
        setLoading(false);
      }
    });
    return unsubscribeAuth;
  }, []);

  // Sync profile document from Firestore when authenticated
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribeProfile = onSnapshot(userDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.data() as UserProfile);
      } else {
        // Create initial user profile in Firestore
        const initialProfile: UserProfile = {
          ...DEFAULT_PROFILE,
          name: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email || "",
          aiSettings: {
            provider: "gemini" as any,
            thinkingMode: "normal" as any,
            voiceAutoPunctuation: true,
            voiceRemoveFiller: true,
            translateWhileTyping: false,
            detectLanguage: true,
            incognitoMode: false
          }
        };
        try {
          await setDoc(userDocRef, initialProfile);
          setProfile(initialProfile);
        } catch (e) {
          console.error("Error creating initial user profile:", e);
        }
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user profile from Firestore:", error);
      setLoading(false);
    });

    return unsubscribeProfile;
  }, [user]);

  // Verify server-side key status on startup
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          setApiKeyStatus("online");
        } else {
          setApiKeyStatus("offline");
        }
      } catch (e) {
        setApiKeyStatus("offline");
      }
    };
    checkApiKey();
  }, []);

  const getFriendlyErrorMessage = (error: any): string => {
    if (!error) return "Something went wrong.";
    const code = error.code || "";
    const msg = error.message || "";
    
    if (code === "auth/user-not-found" || msg.includes("user-not-found")) {
      return "Unable to find an account with this email.";
    }
    if (code === "auth/wrong-password" || msg.includes("wrong-password")) {
      return "Incorrect password. Please try again.";
    }
    if (code === "auth/email-already-in-use" || msg.includes("email-already-in-use")) {
      return "An account with this email already exists.";
    }
    if (code === "auth/weak-password" || msg.includes("weak-password")) {
      return "Password should be at least 6 characters.";
    }
    if (code === "auth/invalid-email" || msg.includes("invalid-email")) {
      return "Invalid email format.";
    }
    if (code === "auth/network-request-failed" || msg.includes("network-request-failed") || msg.includes("offline")) {
      return "Please check your internet connection and try again.";
    }
    if (code === "auth/too-many-requests" || msg.includes("too-many-requests")) {
      return "Too many unsuccessful attempts. Please try again later.";
    }
    if (code === "auth/operation-not-allowed" || msg.includes("operation-not-allowed") || code === "auth/admin-restricted-operation" || msg.includes("admin-restricted-operation")) {
      return "This sign-in method is not enabled. Please enable Email/Password and Anonymous in your Firebase Console under Authentication > Sign-in method.";
    }
    if (code === "auth/unauthorized-domain" || msg.includes("unauthorized-domain")) {
      return "This domain is not authorized for Google Auth. Please add the app URL to your Firebase Console under Authentication > Settings > Authorized domains.";
    }
    return "Something went wrong. Please check your credentials or connection and try again.";
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    console.log("Auth started, mode:", isSignUp ? "Sign Up" : "Sign In");
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      if (isSignUp) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Sign up successful");
        if (credential.user) {
          try {
            await sendEmailVerification(credential.user);
            setSuccessMessage("Account created successfully! Verification email sent. Please check your inbox.");
          } catch (evErr) {
            console.error("Error sending email verification:", evErr);
            setSuccessMessage("Account created successfully!");
          }
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Sign in successful");
      }
    } catch (error: any) {
      console.error("Auth failed:", error);
      setErrorMessage(getFriendlyErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    console.log("Google Auth started");
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log("Google Auth successful");
    } catch (error: any) {
      console.error("Google Auth failed:", error);
      setErrorMessage(getFriendlyErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAuth = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    console.log("Guest login started");
    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInAnonymously(auth);
      console.log("Guest login successful");
    } catch (error: any) {
      console.error("Guest login failed:", error);
      setErrorMessage(getFriendlyErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email address first.");
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset email sent! Please check your inbox.");
    } catch (error: any) {
      console.error("Password reset failed:", error);
      setErrorMessage(getFriendlyErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-slate-950 font-sans">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-6 font-sans">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white/10 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {isForgotPassword ? "Reset Password" : isSignUp ? "Create Account" : "Sign In"}
            </h2>
            <p className="text-xs text-white/60">
              {isForgotPassword 
                ? "Enter your email to receive a password reset link" 
                : isSignUp 
                  ? "Get started with your custom glass BreezyKeyboard" 
                  : "Sign in to sync your custom keyboard settings"}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/35 rounded-xl flex items-start space-x-2.5 text-xs text-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/35 rounded-xl flex items-start space-x-2.5 text-xs text-emerald-200">
              <UserCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {isForgotPassword ? (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 bg-black/30 rounded-xl text-white text-sm border border-white/10 focus:outline-none focus:border-cyan-500/50" 
                  required 
                />
              </div>
              <button type="submit" className="w-full p-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white font-bold text-sm transition-colors shadow-lg">
                Send Reset Link
              </button>
              <button 
                type="button" 
                onClick={() => { setIsForgotPassword(false); setErrorMessage(null); setSuccessMessage(null); }} 
                className="w-full text-center text-xs text-white/50 hover:text-white transition-colors"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full pl-10 pr-4 py-3 bg-black/30 rounded-xl text-white text-sm border border-white/10 focus:outline-none focus:border-cyan-500/50" 
                    required 
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full pl-10 pr-4 py-3 bg-black/30 rounded-xl text-white text-sm border border-white/10 focus:outline-none focus:border-cyan-500/50" 
                    required 
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-white/60">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)} 
                      className="rounded border-white/10 bg-black/30 text-cyan-500 focus:ring-0 focus:ring-offset-0" 
                    />
                    <span>Remember Me</span>
                  </label>
                  {!isSignUp && (
                    <button 
                      type="button" 
                      onClick={() => { setIsForgotPassword(true); setErrorMessage(null); setSuccessMessage(null); }} 
                      className="hover:text-white transition-colors"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>

                <button type="submit" className="w-full p-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white font-bold text-sm transition-colors shadow-lg">
                  {isSignUp ? "Sign Up" : "Sign In"}
                </button>
              </form>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-[10px] text-white/40 uppercase tracking-widest">Or continue with</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleGoogleAuth} 
                  className="p-3 bg-white hover:bg-slate-100 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.74-.08-1.3-.176-1.856H12.24z"/>
                  </svg>
                  <span>Google</span>
                </button>
                <button 
                  onClick={handleGuestAuth} 
                  className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all border border-white/10 shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Guest Mode</span>
                </button>
              </div>

              <button 
                onClick={() => { setIsSignUp(!isSignUp); setErrorMessage(null); setSuccessMessage(null); }} 
                className="w-full text-center text-xs text-white/50 hover:text-white transition-colors"
              >
                {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
              </button>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  // Check if email verification is pending (for email/password users)
  if (user && !user.isAnonymous && !user.emailVerified) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-6 font-sans text-white relative overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-2xl z-0" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="w-full max-w-md bg-white/10 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 shadow-2xl space-y-6 z-10"
        >
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <AlertCircle className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Email Verification Required</h2>
            <p className="text-xs text-white/70 leading-relaxed">
              We've sent a verification link to secure your BreezyKeyboard profile. Please check your inbox and click the verification link.
            </p>
            <div className="inline-block px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full font-mono text-xs text-cyan-300 font-bold tracking-wider">
              {user.email}
            </div>
          </div>

          {verificationError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/35 rounded-xl flex items-start space-x-2.5 text-xs text-rose-200">
              <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{verificationError}</span>
            </div>
          )}

          {verificationSuccess && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/35 rounded-xl flex items-start space-x-2.5 text-xs text-emerald-200">
              <UserCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{verificationSuccess}</span>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button 
              onClick={handleCheckVerification}
              disabled={verifying}
              className="w-full p-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-2 text-white cursor-pointer"
            >
              {verifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Checking status...</span>
                </>
              ) : (
                <span>I Have Verified My Email</span>
              )}
            </button>

            <button 
              onClick={handleResendVerification}
              disabled={resendCooldown > 0}
              className="w-full p-3 bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:opacity-50 rounded-xl font-bold text-xs border border-white/10 transition-all text-white cursor-pointer"
            >
              {resendCooldown > 0 ? `Resend Link in ${resendCooldown}s` : "Resend Verification Link"}
            </button>

            <button 
              onClick={() => signOut(auth)}
              className="w-full p-3 bg-transparent hover:bg-white/5 rounded-xl font-medium text-xs text-white/55 hover:text-white transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out / Switch Account</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full text-white flex flex-col font-sans selection:bg-white/30 selection:text-white overflow-x-hidden relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-3xl z-0" />
      
      {/* Header with Logout */}
      <header className="w-full h-16 border-b border-white/10 bg-[#06080d]/65 backdrop-blur-xl flex items-center justify-between px-6 md:px-12 z-30 shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 backdrop-blur-md p-[1.5px] flex items-center justify-center shadow-lg">
            <div className="w-full h-full rounded-[9px] bg-slate-900/50 flex items-center justify-center font-black text-white text-base">
              BK
            </div>
          </div>
          <div>
            <h1 className="text-sm md:text-base font-semibold tracking-tight font-display">
              <span className="text-white">BREEZYKEYBOARD</span>
            </h1>
            <p className="text-[10px] text-slate-300 font-medium">
              {user.isAnonymous ? "Guest Session" : user.email}
            </p>
          </div>
        </div>

        <button onClick={() => signOut(auth)} className="px-4 py-2 bg-white/10 rounded-full text-xs font-semibold hover:bg-white/20 flex items-center space-x-1">
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </header>

      {user && !user.isAnonymous && !user.emailVerified && (
        <div className="w-full bg-amber-500/20 border-b border-amber-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-amber-200 z-30 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Please verify your email address to enable secure cloud sync.</span>
          </div>
          <button 
            onClick={async () => {
              try {
                if (auth.currentUser) {
                  await sendEmailVerification(auth.currentUser);
                  alert("Verification email resent successfully! Check your inbox.");
                }
              } catch (e: any) {
                alert(e?.message || "Failed to resend verification email. Try again later.");
              }
            }} 
            className="px-2.5 py-1 bg-amber-500/30 hover:bg-amber-500/40 text-amber-100 rounded text-[10.5px] font-bold transition-colors"
          >
            Resend Email
          </button>
        </div>
      )}

      {/* 3. PRIMARY CONTENT GRID */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start z-20">
        
        {/* COLUMN A: HIGH-FIDELITY MOBILE EMULATOR */}
        <div className="lg:col-span-5 flex justify-center">
          <AndroidMockup
            userProfile={profile}
            onChangeProfile={async (newProf) => {
              setProfile(newProf);
              if (user) {
                try {
                  const userDocRef = doc(db, "users", user.uid);
                  await setDoc(userDocRef, newProf);
                } catch (e) {
                  console.error("Error writing profile to Firestore:", e);
                }
              }
            }}
          />
        </div>

        {/* COLUMN B: DEVELOPER BOARD / SCENARIO INJECTOR */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Welcome Dashboard Panel */}
          <div className="glass-morphic p-6 rounded-2xl space-y-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border-t border-l border-white/15">
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center space-x-2 font-display">
              <Sparkles className="text-white w-5 h-5 animate-pulse" />
              <span className="text-white">Android Glass AI Keyboard Panel</span>
            </h2>
            <p className="text-xs text-white/70 leading-relaxed">
              BreezyKeyboard merges typing speeds, next-word multilingual prediction, voice transcript corrections, privacy shields, and dynamic translations inside one unified ecosystem. Use the **Mobile Emulator on the left** to fully experience custom themes, voice, and AI modes.
            </p>

            <div className="grid grid-cols-2 gap-3.5 pt-2">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] space-y-1">
                <span className="text-[10px] text-white/70 uppercase font-mono tracking-wider block">Typing Language</span>
                <span className="text-xs font-bold text-white flex items-center space-x-1">
                  <Globe className="w-3.5 h-3.5 text-white" />
                  <span className="text-white/90">English, Swahili, Spanish, French, Kikuyu</span>
                </span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] space-y-1">
                <span className="text-[10px] text-white/70 uppercase font-mono tracking-wider block">Privacy Core</span>
                <span className="text-xs font-bold text-white flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span className="text-white/90">PII Leak &amp; Scam Protection</span>
                </span>
              </div>
            </div>
          </div>

          {/* Scenario Sandbox Presets */}
          <div className="glass-morphic p-6 rounded-2xl space-y-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border-t border-l border-white/15">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                <span>AI Keyboard Scenario Presets</span>
              </h3>
              <p className="text-[11px] text-white/70">
                To test the keyboard's full capabilities instantly, choose one of these preconfigured scenarios. It will set up the emulator to demonstrate Glass AI, Voice, or Privacy filters.
              </p>
            </div>

            <div className="space-y-3.5">
              
              {/* Preset 1: Privacy Leak test */}
              <div className="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/30 transition-all flex justify-between items-center group shadow-md cursor-pointer backdrop-blur-sm">
                <div className="space-y-1 pr-4">
                  <span className="px-2 py-0.5 bg-white/20 text-white text-[8.5px] font-bold rounded uppercase tracking-wide border border-white/30">
                    Glass Protect Demo
                  </span>
                  <h4 className="text-xs font-bold text-white transition-colors">
                    Detect Accidental Credential Sharing
                  </h4>
                  <p className="text-[10.5px] text-white/70 italic">
                    "My administrative password is AdminPass123 and credit card is 4111222233334444."
                  </p>
                </div>
                <div className="text-[10px] text-white/50 font-semibold uppercase transition-all text-right select-none max-w-[140px] leading-tight">
                  {"Open Messenger & Focus Keyboard, then tap \"Protect\" tab to Scan!"}
                </div>
              </div>

              {/* Preset 2: Speech transcript */}
              <div className="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/30 transition-all flex justify-between items-center group shadow-md cursor-pointer backdrop-blur-sm">
                <div className="space-y-1 pr-4">
                  <span className="px-2 py-0.5 bg-white/20 text-white text-[8.5px] font-bold rounded uppercase tracking-wide border border-white/30">
                    Glass Voice Demo
                  </span>
                  <h4 className="text-xs font-bold text-white transition-colors">
                    Intelligent Audio Cleanup &amp; Punctuation
                  </h4>
                  <p className="text-[10.5px] text-white/70 italic">
                    "so um basically like yeah we should definitely like build a keyboard app that does like automatic punctuation and stuff you know"
                  </p>
                </div>
                <div className="text-[10px] text-white/50 font-semibold uppercase transition-all text-right select-none max-w-[140px] leading-tight">
                  Tap "Voice" tab inside Keyboard Toolbar for automatic filler deletion!
                </div>
              </div>

              {/* Preset 3: Swahili training */}
              <div className="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/30 transition-all flex justify-between items-center group shadow-md cursor-pointer backdrop-blur-sm">
                <div className="space-y-1 pr-4">
                  <span className="px-2 py-0.5 bg-white/20 text-white text-[8.5px] font-bold rounded uppercase tracking-wide border border-white/30">
                    Glass Translate &amp; Academy
                  </span>
                  <h4 className="text-xs font-bold text-white transition-colors">
                    Multilingual Conversational Bridging
                  </h4>
                  <p className="text-[10.5px] text-white/70 italic">
                    "Hujambo, marafiki zangu! Leo tutajifunza Kiswahili na Kingereza kwa pamoja."
                  </p>
                </div>
                <div className="text-[10px] text-white/50 font-semibold uppercase transition-all text-right select-none max-w-[140px] leading-tight">
                  {"Use \"Translate\" on the keyboard bar or do dynamic quizzes in the Academy tab!"}
                </div>
              </div>

            </div>
          </div>

          {/* Platform and secrets credentials guidance */}
          <div className="p-4 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 flex items-start space-x-3 text-[11px] text-white/70 shadow-lg">
            <Info className="w-5 h-5 text-white shrink-0" />
            <div className="space-y-1">
              <span className="font-bold text-white block uppercase tracking-wide text-[10px]">Secure Server-Side API Handlers</span>
              <p>
                {"All dynamic writing corrections, tone changes, cyber protect report generation, and dictionary challenges run securely via the back-end Express server and utilize Gemini 3.5. If your responses are missing, verify that your credentials are set up inside the Settings > Secrets panel in Google AI Studio."}
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* 5. FOOTER */}
      <footer className="w-full h-14 border-t border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center px-12 z-30 shrink-0 text-xs text-white/50">
        <span>BreezyKeyboard Applet &copy; 2026. All Rights Reserved.</span>
      </footer>

    </div>
  );
}
