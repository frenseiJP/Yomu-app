import type { Lang } from "@/src/utils/i18n/types";

export type LoginCopy = {
  signIn: string;
  signUp: string;
  authServiceDown: string;
  continueGuest: string;
  continueGoogle: string;
  orUseEmail: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  confirmPassword: string;
  passwordHint: string;
  showPassword: string;
  hidePassword: string;
  agreePrefix: string;
  termsLink: string;
  agreeMiddle: string;
  privacyLink: string;
  agreeSuffix: string;
  agreeRequired: string;
  passwordsMismatch: string;
  passwordMinLength: string;
  passwordLowercase: string;
  passwordDigit: string;
  sending: string;
  googleFailed: string;
  oauthFailed: string;
  authCallbackFailed: string;
  confirmationEmailSent: string;
  tagline: string;
};

const LOGIN_COPY: Record<Lang, LoginCopy> = {
  en: {
    signIn: "Sign in",
    signUp: "Sign up",
    authServiceDown:
      "Cannot connect to the auth service (Supabase). The project may need recovery. Please contact support.",
    continueGuest: "Your trial chat is saved. Sign up or sign in to continue where you left off.",
    continueGoogle: "Continue with Google",
    orUseEmail: "or use email",
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    confirmPassword: "Confirm password",
    passwordHint: "At least 8 characters, one lowercase letter, and one digit.",
    showPassword: "Show password",
    hidePassword: "Hide password",
    agreePrefix: "I have read and agree to the ",
    termsLink: "Terms of Service",
    agreeMiddle: " and ",
    privacyLink: "Privacy Policy",
    agreeSuffix: ".",
    agreeRequired: "You must agree to the Terms of Service and Privacy Policy.",
    passwordsMismatch: "Passwords do not match.",
    passwordMinLength: "Password must be at least 8 characters.",
    passwordLowercase: "Include at least one lowercase letter.",
    passwordDigit: "Include at least one digit.",
    sending: "Sending…",
    googleFailed: "Google sign-in failed. Please try email instead.",
    oauthFailed:
      "Google sign-in failed. Try email sign-in, or check Supabase Google provider settings.",
    authCallbackFailed:
      "Email verification link expired or invalid. Please sign in again or request a new link.",
    confirmationEmailSent:
      "We sent a confirmation email. Open the link in the message to verify your account.",
    tagline: "Frensei — Japanese and culture, together.",
  },
  ja: {
    signIn: "ログイン",
    signUp: "新規登録",
    authServiceDown:
      "認証サービス（Supabase）に接続できません。プロジェクトの復旧が必要です。運営にお問い合わせください。",
    continueGuest: "体験チャットは保存されています。登録またはログインして会話を続けてください。",
    continueGoogle: "Googleで続ける",
    orUseEmail: "またはメールで",
    email: "メールアドレス",
    emailPlaceholder: "you@example.com",
    password: "パスワード",
    confirmPassword: "パスワード（確認）",
    passwordHint: "8文字以上、小文字1文字以上、数字1文字以上。",
    showPassword: "パスワードを表示",
    hidePassword: "パスワードを非表示",
    agreePrefix: "",
    termsLink: "利用規約",
    agreeMiddle: "と",
    privacyLink: "プライバシーポリシー",
    agreeSuffix: "を確認し、同意します。",
    agreeRequired: "利用規約とプライバシーポリシーへの同意が必要です。",
    passwordsMismatch: "パスワードが一致しません。",
    passwordMinLength: "パスワードは8文字以上にしてください。",
    passwordLowercase: "小文字を1文字以上含めてください。",
    passwordDigit: "数字を1文字以上含めてください。",
    sending: "送信中…",
    googleFailed: "Googleログインに失敗しました。メールでお試しください。",
    oauthFailed:
      "Googleログインに失敗しました。メールでログインするか、SupabaseのGoogle設定を確認してください。",
    authCallbackFailed:
      "確認リンクの有効期限が切れているか無効です。再度ログインするか、新しいリンクをリクエストしてください。",
    confirmationEmailSent:
      "確認メールを送信しました。メール内のリンクを開いてアカウントを認証してください。",
    tagline: "Frensei — 日本語と文化を、一緒に。",
  },
  ko: {
    signIn: "로그인",
    signUp: "회원가입",
    authServiceDown:
      "인증 서비스(Supabase)에 연결할 수 없습니다. 프로젝트 복구가 필요할 수 있습니다. 지원팀에 문의해 주세요.",
    continueGuest: "체험 대화가 저장되었습니다. 가입 또는 로그인 후 이어서 대화하세요.",
    continueGoogle: "Google로 계속",
    orUseEmail: "또는 이메일로",
    email: "이메일",
    emailPlaceholder: "you@example.com",
    password: "비밀번호",
    confirmPassword: "비밀번호 확인",
    passwordHint: "8자 이상, 소문자 1자 이상, 숫자 1자 이상.",
    showPassword: "비밀번호 표시",
    hidePassword: "비밀번호 숨기기",
    agreePrefix: "",
    termsLink: "이용약관",
    agreeMiddle: " 및 ",
    privacyLink: "개인정보 처리방침",
    agreeSuffix: "을(를) 확인하고 동의합니다.",
    agreeRequired: "이용약관과 개인정보 처리방침에 동의해야 합니다.",
    passwordsMismatch: "비밀번호가 일치하지 않습니다.",
    passwordMinLength: "비밀번호는 8자 이상이어야 합니다.",
    passwordLowercase: "소문자를 1자 이상 포함해 주세요.",
    passwordDigit: "숫자를 1자 이상 포함해 주세요.",
    sending: "전송 중…",
    googleFailed: "Google 로그인에 실패했습니다. 이메일로 시도해 주세요.",
    oauthFailed:
      "Google 로그인에 실패했습니다. 이메일 로그인을 시도하거나 Supabase Google 설정을 확인해 주세요.",
    authCallbackFailed:
      "이메일 확인 링크가 만료되었거나 유효하지 않습니다. 다시 로그인하거나 새 링크를 요청해 주세요.",
    confirmationEmailSent:
      "확인 이메일을 보냈습니다. 메일의 링크를 열어 계정을 인증해 주세요.",
    tagline: "Frensei — 일본어와 문화를 함께.",
  },
  zh: {
    signIn: "登录",
    signUp: "注册",
    authServiceDown:
      "无法连接认证服务（Supabase）。项目可能需要恢复。请联系支持团队。",
    continueGuest: "试用对话已保存。注册或登录后可继续对话。",
    continueGoogle: "使用 Google 继续",
    orUseEmail: "或使用邮箱",
    email: "邮箱",
    emailPlaceholder: "you@example.com",
    password: "密码",
    confirmPassword: "确认密码",
    passwordHint: "至少 8 个字符，含一个小写字母和一个数字。",
    showPassword: "显示密码",
    hidePassword: "隐藏密码",
    agreePrefix: "我已阅读并同意",
    termsLink: "服务条款",
    agreeMiddle: "和",
    privacyLink: "隐私政策",
    agreeSuffix: "。",
    agreeRequired: "必须同意服务条款和隐私政策。",
    passwordsMismatch: "两次输入的密码不一致。",
    passwordMinLength: "密码至少需要 8 个字符。",
    passwordLowercase: "请至少包含一个小写字母。",
    passwordDigit: "请至少包含一个数字。",
    sending: "发送中…",
    googleFailed: "Google 登录失败。请尝试使用邮箱。",
    oauthFailed: "Google 登录失败。请尝试邮箱登录，或检查 Supabase 的 Google 设置。",
    authCallbackFailed: "邮箱验证链接已过期或无效。请重新登录或请求新链接。",
    confirmationEmailSent: "我们已发送确认邮件。请打开邮件中的链接完成验证。",
    tagline: "Frensei — 日语与文化，一起学。",
  },
};

export function getLoginCopy(lang: Lang): LoginCopy {
  return LOGIN_COPY[lang] ?? LOGIN_COPY.en;
}

export function validatePasswordForLang(p: string, lang: Lang): string | null {
  const c = getLoginCopy(lang);
  if (p.length < 8) return c.passwordMinLength;
  if (!/[a-z]/.test(p)) return c.passwordLowercase;
  if (!/[0-9]/.test(p)) return c.passwordDigit;
  return null;
}
