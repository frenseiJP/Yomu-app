"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";
import { Mail, Lock, BookOpen, Eye, EyeOff } from "lucide-react";

type Mode = "login" | "signup";

const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function setInitialLangCookiesEn() {
  if (typeof document === "undefined") return;
  document.cookie = `yomu_lang=${encodeURIComponent("en")}; path=/; max-age=${LANG_COOKIE_MAX_AGE}; SameSite=Lax`;
  document.cookie = `yomu_first_lang=${encodeURIComponent("en")}; path=/; max-age=${LANG_COOKIE_MAX_AGE}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent("yomu:lang-changed", { detail: { lang: "en" } }));
}

function validatePassword(p: string): string | null {
  if (p.length < 8) return "Password must be at least 8 characters.";
  if (!/[a-z]/.test(p)) return "Include at least one lowercase letter.";
  if (!/[0-9]/.test(p)) return "Include at least one digit.";
  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const supabase = createClient();

  // App Store 等のリンク（/login?intent=signup など）で登録タブを開く（useSearchParams よりビルド都合で search を直接読む）
  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search);
    if (q.get("intent") === "signup" || q.get("signup") === "1") {
      setMode("signup");
    }
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          router.replace("/chat");
          return;
        }
      } catch {
        // ignore
      } finally {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    if (mode !== "signup" || typeof document === "undefined") return;
    const hasLangCookie = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("yomu_lang="));
    if (hasLangCookie) return;
    setInitialLangCookiesEn();
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup") {
      const pwdError = validatePassword(password);
      if (pwdError) {
        setError(pwdError);
        return;
      }
      if (!agreedToPolicies) {
        setError("利用規約とプライバシーポリシーへの同意が必要です。");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) {
          if (signInError.message.includes("Invalid login")) {
            setError("Invalid email or password.");
          } else {
            setError(signInError.message);
          }
          return;
        }
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/onboarding` },
        });
        if (signUpError) {
          if (signUpError.message.includes("already registered")) {
            setError("This email is already registered. Please sign in.");
          } else {
            setError(signUpError.message);
          }
          return;
        }
        setInitialLangCookiesEn();
        setError(null);
        setMode("login");
        setError("We sent a confirmation email. Open the link in the message to verify your account.");
        setLoading(false);
        return;
      }
      router.replace("/chat");
    } catch (err) {
      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500/30 border-t-pink-400" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#020617] px-4 py-8">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-slate-400 transition hover:text-slate-200"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-wa-ruri to-wa-asagi text-sm font-bold text-white shadow-lg">
          <BookOpen className="h-5 w-5" />
        </div>
        <span className="font-wa-serif text-lg font-semibold text-slate-100">
          Yomu
        </span>
      </Link>

      <div
        className="w-full max-w-sm rounded-2xl border border-pink-500/20 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(236,72,153,0.08)] backdrop-blur-xl sm:p-8"
        style={{ boxShadow: "0 0 40px rgba(236,72,153,0.06), 0 0 0 1px rgba(236,72,153,0.1)" }}
      >
        <div className="mb-6 flex rounded-xl bg-slate-900/60 p-1">
          <button
            type="button"
            onClick={() => { setMode("login"); setError(null); }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
              mode === "login"
                ? "bg-slate-800 text-slate-100 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(null); }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
              mode === "signup"
                ? "bg-slate-800 text-slate-100 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-400">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 py-3 pl-10 pr-4 text-slate-100 placeholder-slate-500 focus:border-pink-500/40 focus:outline-none focus:ring-1 focus:ring-pink-500/30"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-slate-400">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 py-3 pl-10 pr-11 text-slate-100 placeholder-slate-500 focus:border-pink-500/40 focus:outline-none focus:ring-1 focus:ring-pink-500/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {mode === "signup" && (
              <p className="mt-1 text-[11px] text-slate-500">
                At least 8 characters, one lowercase letter, and one digit.
              </p>
            )}
          </div>

          {mode === "signup" && (
            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-medium text-slate-400">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 py-3 pl-10 pr-11 text-slate-100 placeholder-slate-500 focus:border-pink-500/40 focus:outline-none focus:ring-1 focus:ring-pink-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === "signup" && (
            <label className="flex items-start gap-2 rounded-xl border border-slate-800/80 bg-slate-900/50 px-3 py-2.5 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={agreedToPolicies}
                onChange={(e) => setAgreedToPolicies(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900 text-pink-500 focus:ring-pink-500/40"
              />
              <span className="leading-5">
                <Link
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-200 underline hover:text-pink-100"
                >
                  利用規約
                </Link>
                と
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-200 underline hover:text-pink-100"
                >
                  プライバシーポリシー
                </Link>
                を確認し、同意します。
              </span>
            </label>
          )}

          {error && (
            <div
              className={`rounded-lg px-3 py-2.5 text-sm ${
                error.includes("confirmation email")
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  : "bg-red-500/10 text-red-300 border border-red-500/20"
              }`}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (mode === "signup" && !agreedToPolicies)}
            className="w-full rounded-xl bg-gradient-to-r from-pink-500/90 to-pink-600/90 py-3.5 font-medium text-white shadow-lg transition hover:from-pink-500 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending…" : mode === "login" ? "Sign in" : "Sign up"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        Frensei (Yomu) — Japanese and culture, together.
      </p>
    </div>
  );
}
