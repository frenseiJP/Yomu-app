"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";
import { logBetaEvent } from "@/lib/analytics/client";
import { formatAuthErrorMessageForLang } from "@/lib/auth/errors";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { getLoginCopy, validatePasswordForLang } from "@/lib/i18n/loginCopy";
import { hasPendingGuestChat } from "@/lib/guest/pendingChat";
import { resolvePostLoginPath } from "@/lib/auth/resolvePostLoginPath";
import { Mail, Lock, BookOpen, Eye, EyeOff } from "lucide-react";

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const { language: uiLang } = useLanguage();
  const copy = getLoginCopy(uiLang);
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
  const [continueGuest, setContinueGuest] = useState(false);
  const [authServiceDown, setAuthServiceDown] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search);
    if (q.get("intent") === "signup" || q.get("signup") === "1") {
      setMode("signup");
    }
    if (q.get("continue") === "guest" || hasPendingGuestChat()) {
      setContinueGuest(true);
    }
    const authErr = q.get("error");
    if (authErr === "oauth" || authErr === "auth_callback") {
      setError(authErr === "oauth" ? copy.oauthFailed : copy.authCallbackFailed);
    }
  }, [copy.oauthFailed, copy.authCallbackFailed]);

  useEffect(() => {
    void fetch("/api/auth/health", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { ok?: boolean }) => setAuthServiceDown(data.ok === false))
      .catch(() => setAuthServiceDown(true));
  }, []);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/app")}`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (oauthError) setError(oauthError.message);
    } catch {
      setError(copy.googleFailed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const destination = await resolvePostLoginPath(supabase, "/app");
          router.replace(destination);
          return;
        }
      } catch {
        // ignore
      } finally {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, [router, supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup") {
      const pwdError = validatePasswordForLang(password, uiLang);
      if (pwdError) {
        setError(pwdError);
        return;
      }
      if (!agreedToPolicies) {
        setError(copy.agreeRequired);
        return;
      }
      if (password !== confirmPassword) {
        setError(copy.passwordsMismatch);
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) {
          setError(formatAuthErrorMessageForLang(uiLang, signInError));
          return;
        }
        void logBetaEvent({
          eventType: "login_success",
          userId: signInData.user?.id,
          route: "/login",
          metadata: { mode: "login" },
        });
      } else {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/onboarding")}`,
          },
        });
        if (signUpError) {
          setError(formatAuthErrorMessageForLang(uiLang, signUpError));
          return;
        }
        if (signUpData.session) {
          void logBetaEvent({
            eventType: "login_success",
            userId: signUpData.user?.id,
            route: "/login",
            metadata: { mode: "signup" },
          });
          router.replace("/onboarding");
          return;
        }
        setMode("login");
        setError(copy.confirmationEmailSent);
        setLoading(false);
        return;
      }
      const destination = await resolvePostLoginPath(supabase, "/app");
      router.replace(destination);
    } catch (err) {
      setError(formatAuthErrorMessageForLang(uiLang, err));
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen min-h-[100dvh] items-center justify-center overflow-x-hidden bg-[#020617]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500/30 border-t-pink-400" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col items-center justify-center overflow-x-hidden bg-[#020617] px-4 py-8 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] pt-[max(2rem,env(safe-area-inset-top,0px))]">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-slate-400 transition hover:text-slate-200"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-wa-ruri to-wa-asagi text-sm font-bold text-white shadow-lg">
          <BookOpen className="h-5 w-5" />
        </div>
        <span className="font-wa-serif text-lg font-semibold text-slate-100">Frensei</span>
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
            {copy.signIn}
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
            {copy.signUp}
          </button>
        </div>

        {authServiceDown ? (
          <div className="mb-4 rounded-xl border border-amber-500/35 bg-amber-500/10 px-3 py-2.5 text-xs leading-relaxed text-amber-100">
            {copy.authServiceDown}
          </div>
        ) : null}

        {continueGuest ? (
          <div className="mb-4 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2.5 text-xs leading-relaxed text-sky-100">
            {copy.continueGuest}
          </div>
        ) : null}

        <button
          type="button"
          disabled={loading}
          onClick={() => void handleGoogleSignIn()}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 py-3 text-sm font-medium text-slate-100 transition hover:border-slate-600 hover:bg-slate-900"
        >
          <span className="text-base" aria-hidden>
            G
          </span>
          {copy.continueGoogle}
        </button>

        <p className="mb-4 text-center text-[11px] text-slate-500">{copy.orUseEmail}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-400">
              {copy.email}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={copy.emailPlaceholder}
                required
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 py-3 pl-10 pr-4 text-slate-100 placeholder-slate-500 focus:border-pink-500/40 focus:outline-none focus:ring-1 focus:ring-pink-500/30"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-slate-400">
              {copy.password}
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
                aria-label={showPassword ? copy.hidePassword : copy.showPassword}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {mode === "signup" && (
              <p className="mt-1 text-[11px] text-slate-500">{copy.passwordHint}</p>
            )}
          </div>

          {mode === "signup" && (
            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-medium text-slate-400">
                {copy.confirmPassword}
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
                  aria-label={showConfirmPassword ? copy.hidePassword : copy.showPassword}
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
                {copy.agreePrefix}
                <Link
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-200 underline hover:text-pink-100"
                >
                  {copy.termsLink}
                </Link>
                {copy.agreeMiddle}
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-200 underline hover:text-pink-100"
                >
                  {copy.privacyLink}
                </Link>
                {copy.agreeSuffix}
              </span>
            </label>
          )}

          {error && (
            <div
              className={`rounded-lg px-3 py-2.5 text-sm ${
                error === copy.confirmationEmailSent
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
            {loading ? copy.sending : mode === "login" ? copy.signIn : copy.signUp}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">{copy.tagline}</p>
    </div>
  );
}
