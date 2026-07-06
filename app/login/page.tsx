"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/src/utils/supabase/client";
import { logBetaEvent } from "@/lib/analytics/client";
import { getStoredAttribution } from "@/lib/analytics/attribution";
import { formatAuthErrorMessageForLang } from "@/lib/auth/errors";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { getLoginCopy, validatePasswordForLang } from "@/lib/i18n/loginCopy";
import { hasPendingGuestChat } from "@/lib/guest/pendingChat";
import { resolvePostLoginPath } from "@/lib/auth/resolvePostLoginPath";
import MarketingShell from "@/components/marketing/MarketingShell";
import { mkt } from "@/lib/ui/appTheme";
import { Mail, Lock, BookOpen, Eye, EyeOff } from "lucide-react";

type Mode = "login" | "signup";

function loginSuccessMetadata(mode: Mode): Record<string, string | undefined> {
  const attr = getStoredAttribution();
  let fromParam: string | null = null;
  if (typeof window !== "undefined") {
    fromParam = new URLSearchParams(window.location.search).get("from");
  }
  return {
    mode,
    from: fromParam ?? attr?.from,
    utm_source: attr?.utm_source,
    utm_medium: attr?.utm_medium,
    utm_campaign: attr?.utm_campaign,
  };
}

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
        const {
          data: { user },
        } = await supabase.auth.getUser();
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
    void checkSession();
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
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError(formatAuthErrorMessageForLang(uiLang, signInError));
          return;
        }
        void logBetaEvent({
          eventType: "login_success",
          route: "/login",
          metadata: loginSuccessMetadata("login"),
        });
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) {
          setError(formatAuthErrorMessageForLang(uiLang, signUpError));
          return;
        }
        void logBetaEvent({
          eventType: "login_success",
          route: "/login",
          metadata: loginSuccessMetadata("signup"),
        });
        setError(copy.confirmationEmailSent);
        return;
      }
      const destination = await resolvePostLoginPath(supabase, "/app");
      router.replace(destination);
    } catch {
      setError(copy.googleFailed);
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <MarketingShell className="flex min-h-[100dvh] items-center justify-center">
        <div className={mkt.spinner} />
      </MarketingShell>
    );
  }

  return (
    <MarketingShell className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-8">
      <Link href="/" className={`mb-8 flex items-center gap-2 ${mkt.link}`}>
        <div className={mkt.brandIcon}>
          <BookOpen className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold text-slate-900">Frensei</span>
      </Link>

      <div className={`w-full max-w-sm p-6 sm:p-8 ${mkt.card}`}>
        <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
              mode === "login" ? "bg-white text-slate-900 shadow-sm" : `${mkt.muted} hover:text-slate-900`
            }`}
          >
            {copy.signIn}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
              mode === "signup" ? "bg-white text-slate-900 shadow-sm" : `${mkt.muted} hover:text-slate-900`
            }`}
          >
            {copy.signUp}
          </button>
        </div>

        {authServiceDown ? <div className={`mb-4 ${mkt.alertWarn}`}>{copy.authServiceDown}</div> : null}
        {continueGuest ? <div className={`mb-4 ${mkt.alertInfo}`}>{copy.continueGuest}</div> : null}

        <button
          type="button"
          disabled={loading}
          onClick={() => void handleGoogleSignIn()}
          className={`mb-4 flex w-full items-center justify-center gap-2 ${mkt.secondaryBtn} py-3`}
        >
          <span className="text-base" aria-hidden>
            G
          </span>
          {copy.continueGoogle}
        </button>

        <p className={`mb-4 text-center text-[11px] ${mkt.faint}`}>{copy.orUseEmail}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className={`mb-1.5 block text-xs font-medium ${mkt.muted}`}>
              {copy.email}
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${mkt.faint}`} />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={copy.emailPlaceholder}
                required
                className={`${mkt.fieldLg} pl-10 pr-4`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={`mb-1.5 block text-xs font-medium ${mkt.muted}`}>
              {copy.password}
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${mkt.faint}`} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`${mkt.fieldLg} pl-10 pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${mkt.faint} hover:text-slate-700`}
                aria-label={showPassword ? copy.hidePassword : copy.showPassword}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {mode === "signup" && <p className={`mt-1 text-[11px] ${mkt.faint}`}>{copy.passwordHint}</p>}
          </div>

          {mode === "signup" && (
            <div>
              <label htmlFor="confirmPassword" className={`mb-1.5 block text-xs font-medium ${mkt.muted}`}>
                {copy.confirmPassword}
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${mkt.faint}`} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`${mkt.fieldLg} pl-10 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${mkt.faint} hover:text-slate-700`}
                  aria-label={showConfirmPassword ? copy.hidePassword : copy.showPassword}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === "signup" && (
            <label className={`flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs ${mkt.body}`}>
              <input
                type="checkbox"
                checked={agreedToPolicies}
                onChange={(e) => setAgreedToPolicies(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="leading-5">
                {copy.agreePrefix}
                <Link href="/terms" target="_blank" rel="noopener noreferrer" className={mkt.link}>
                  {copy.termsLink}
                </Link>
                {copy.agreeMiddle}
                <Link href="/privacy" target="_blank" rel="noopener noreferrer" className={mkt.link}>
                  {copy.privacyLink}
                </Link>
                {copy.agreeSuffix}
              </span>
            </label>
          )}

          {error && (
            <div className={error === copy.confirmationEmailSent ? mkt.alertSuccess : mkt.alertError}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (mode === "signup" && !agreedToPolicies)}
            className={mkt.ctaFull}
          >
            {loading ? copy.sending : mode === "login" ? copy.signIn : copy.signUp}
          </button>
        </form>
      </div>

      <p className={`mt-6 text-center text-xs ${mkt.faint}`}>{copy.tagline}</p>
    </MarketingShell>
  );
}
