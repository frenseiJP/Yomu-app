import { redirect } from "next/navigation";
import Link from "next/link";
import { Target, Sparkles } from "lucide-react";
import { createClient } from "@/src/utils/supabase/server";
import { getLangServer } from "@/src/utils/i18n/serverLang";
import { t } from "@/src/utils/i18n/t";

type DailyPrompt = {
  id: string;
  title_jp: string;
  title_en: string;
  scheduled_date: string;
};

type FeedPost = {
  id: string;
  content_jp: string;
  content_en: string;
  created_at: string;
  isMine: boolean;
};

export default async function CommunityPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient();
  const lang = getLangServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const TODAY_PROMPT_DATE = "2026-04-01";
  const todayStr = new Date().toISOString().slice(0, 10);
  const requestedDateParam = searchParams?.date;
  const targetDate =
    typeof requestedDateParam === "string" && requestedDateParam
      ? requestedDateParam
      : todayStr;

  const { data: promptRow, error: promptError } = await supabase
    .from("prompts")
    .select("id, title_jp, title_en, scheduled_date")
    .eq("scheduled_date", TODAY_PROMPT_DATE)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (promptError) {
    console.error("Failed to load prompt", promptError);
  }

  let currentPrompt: DailyPrompt | null = null;
  if (promptRow) {
    currentPrompt = {
      id: String(promptRow.id),
      title_jp: String(promptRow.title_jp ?? ""),
      title_en: String(promptRow.title_en ?? ""),
      scheduled_date: String(promptRow.scheduled_date ?? targetDate),
    };
  }

  let posts: FeedPost[] = [];
  if (currentPrompt) {
    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("id, user_id, content_jp, content_en, created_at")
      .eq("prompt_id", currentPrompt.id)
      .order("created_at", { ascending: false });

    if (postsError) {
      console.error("Failed to load community posts", postsError);
    } else {
      posts =
        postsData?.map((row: any) => ({
          id: String(row.id),
          content_jp: String(row.content_jp ?? ""),
          content_en: String(row.content_en ?? ""),
          created_at: row.created_at ?? new Date().toISOString(),
          isMine: String(row.user_id ?? "") === String(user.id),
        })) ?? [];
    }
  }

  async function submitPost(formData: FormData) {
    "use server";

    const supabaseForAction = await createClient();
    const {
      data: { user: currentUser },
    } = await supabaseForAction.auth.getUser();
    if (!currentUser) {
      redirect("/login");
    }

    if (!currentPrompt) {
      redirect("/community?postError=no-prompt");
    }

    const content = String(formData.get("content") ?? "").trim();
    const contentEn = String(formData.get("content_en") ?? "").trim();
    const agreed = String(formData.get("agree_terms") ?? "") === "on";

    if (!content) {
      redirect("/community?postError=empty");
    }
    if (!agreed) {
      redirect("/community?postError=agree-required");
    }

    const { error } = await supabaseForAction.from("posts").insert({
      prompt_id: currentPrompt.id,
      user_id: currentUser.id,
      content_jp: content,
      content_en: contentEn || null,
    });

    if (error) {
      console.error("Failed to insert post", error);
      redirect("/community?postError=insert-failed");
    }

    // リダイレクト後はフォームが初期化されるため入力欄は空になる
    redirect("/community");
  }

  async function generateMockPrompts() {
    "use server";

    const supabaseForAction = await createClient();
    const {
      data: { user: currentUser },
    } = await supabaseForAction.auth.getUser();
    if (!currentUser) {
      redirect("/login");
    }

    const baseDate = new Date();
    const rows = Array.from({ length: 5 }).map((_, idx) => {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + idx);
      const dateStr = d.toISOString().slice(0, 10);
      return {
        title_jp: `AI prompt (mock) ${idx + 1}`,
        title_en: `AI prompt mock ${idx + 1}`,
        scheduled_date: dateStr,
      };
    });

    await supabaseForAction.from("prompts").insert(rows);
    redirect("/community");
  }

  return (
    <div
      className="min-h-screen bg-yomu-bg text-slate-100 antialiased"
      style={{ background: "#020617" }}
    >
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="mb-4 rounded-3xl border border-pink-400/70 bg-slate-950/90 p-5 shadow-[0_20px_70px_rgba(236,72,153,0.2)] backdrop-blur-xl sm:mb-6 sm:p-6">
          <div className="mb-2 flex items-center gap-2">
            <Target className="h-4 w-4 text-pink-300" />
            <span className="font-wa-serif text-[11px] font-semibold tracking-[0.18em] text-pink-200">
              TODAY&apos;S PROMPT
            </span>
          </div>
          {currentPrompt ? (
            <>
              <p className="font-wa-serif text-xl leading-relaxed text-pink-100 sm:text-2xl">
                {currentPrompt.title_jp}
              </p>
              <p className="mt-2 text-sm text-pink-200/90 sm:text-base">
                {currentPrompt.title_en}
              </p>
            </>
          ) : (
            <p className="font-wa-serif text-base text-pink-100 sm:text-lg">
              今日のお題を準備中...🌸
            </p>
          )}
        </section>

        <header className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-wa-serif text-lg font-semibold text-slate-50 sm:text-xl">
              {t(lang, "communityTitle")}
            </h1>
            <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
              {t(lang, "communityDescription")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <form
              action="/community"
              method="get"
              className="flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/70 px-3 py-2 text-[11px]"
            >
              <span className="text-slate-400">{t(lang, "pickDateLabel")}</span>
              <input
                type="date"
                name="date"
                defaultValue={targetDate}
                className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60"
              />
              <button
                type="submit"
                className="btn-wa-hover btn-wa-hover-ruri rounded-lg bg-wa-ruri/80 px-3 py-1 text-[11px] font-medium text-slate-50 hover:bg-wa-asagi"
              >
                {t(lang, "pastPromptsButton")}
              </button>
            </form>

            <form action={generateMockPrompts}>
              <button
                type="submit"
                className="btn-wa-hover inline-flex items-center gap-1 rounded-2xl border border-slate-700/80 bg-slate-900/70 px-3 py-1.5 text-[10px] text-slate-300 hover:border-wa-ruri/60 hover:text-slate-50"
              >
                <Sparkles className="h-3 w-3 text-wa-kinari" />
                {t(lang, "adminMockPromptsButton")}
              </button>
            </form>
          </div>
        </header>

        <section className="space-y-4">
          {currentPrompt && (
            <section className="rounded-3xl border border-slate-800/70 bg-slate-950/90 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.85)] sm:p-5">
              <h2 className="font-wa-serif text-[12px] font-semibold text-slate-200">
                {t(lang, "newPostTitle")}
              </h2>

              {searchParams?.postError && (
                <p className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[12px] text-rose-200">
                  {searchParams.postError === "empty"
                    ? "投稿内容（content）を入力してください。"
                    : searchParams.postError === "agree-required"
                      ? "投稿前に利用規約とプライバシーポリシーへの同意が必要です。"
                      : searchParams.postError === "no-prompt"
                        ? "今日のお題が見つからないため投稿できません。"
                        : "投稿に失敗しました。時間をおいて再度お試しください。"}
                </p>
              )}

              <form action={submitPost} className="mt-3 space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-300" htmlFor="content">
                    投稿内容（content）
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={4}
                    required
                    placeholder="例：今日は『いただきます』の背景を学んで、感謝の気持ちを言葉にする文化が好きになりました。"
                    className="w-full resize-none rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-2.5 text-[13px] text-slate-100 placeholder:text-slate-500 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-300" htmlFor="content_en">
                    English (optional)
                  </label>
                  <textarea
                    id="content_en"
                    name="content_en"
                    rows={2}
                    placeholder="Optional translation in English"
                    className="w-full resize-none rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-2.5 text-[13px] text-slate-100 placeholder:text-slate-500 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60"
                  />
                </div>

                <label className="flex items-start gap-2 rounded-xl border border-slate-800/80 bg-slate-900/50 px-3 py-2.5 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    name="agree_terms"
                    required
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
                    を確認し、同意して投稿します。
                  </span>
                </label>

                <button
                  type="submit"
                  className="btn-wa-hover btn-wa-hover-ruri inline-flex items-center gap-2 rounded-xl bg-wa-ruri px-4 py-2.5 text-[12px] font-medium text-slate-50 shadow-glass hover:bg-wa-asagi"
                >
                  規約に同意して投稿する
                </button>
              </form>
            </section>
          )}

          {currentPrompt && (
            <>
              <section className="space-y-2">
                <h2 className="font-wa-serif text-[12px] font-semibold text-slate-200">
                  {t(lang, "yourPostsTitle")}
                </h2>
                {posts.filter((p) => p.isMine).length === 0 ? (
                  <p className="text-[12px] text-slate-500">
                    {t(lang, "noYourPosts")}
                  </p>
                ) : (
                  posts
                    .filter((p) => p.isMine)
                    .map((post) => (
                      <article
                        key={post.id}
                        className="glass-panel rounded-3xl border border-emerald-500/40 bg-slate-950/90 p-4 text-[13px] leading-relaxed text-slate-100 shadow-[0_18px_60px_rgba(0,0,0,0.85)] sm:p-5"
                      >
                        <p className="whitespace-pre-wrap">{post.content_jp}</p>
                        {post.content_en && (
                          <p className="mt-2 text-[12px] text-slate-300 whitespace-pre-wrap">
                            {post.content_en}
                          </p>
                        )}
                      </article>
                    ))
                )}
              </section>

              <section className="space-y-2">
                <h2 className="font-wa-serif text-[12px] font-semibold text-slate-200">
                  {t(lang, "everyonePostsTitle")}
                </h2>
                {posts.length === 0 ? (
                  <p className="text-[12px] text-slate-500">{t(lang, "noEveryonePosts")}</p>
                ) : (
                  posts.map((post) => (
                    <article
                      key={post.id}
                      className="glass-panel rounded-3xl border border-slate-800/70 bg-gradient-to-b from-slate-950/90 via-slate-950/95 to-slate-950/90 p-4 text-[13px] leading-relaxed text-slate-200 shadow-[0_22px_80px_rgba(0,0,0,0.9)] sm:p-5"
                    >
                      <p className="whitespace-pre-wrap text-slate-100">
                        {post.content_jp}
                      </p>
                      {post.content_en && (
                        <p className="mt-2 text-[12px] text-slate-300 whitespace-pre-wrap">
                          {post.content_en}
                        </p>
                      )}
                    </article>
                  ))
                )}
              </section>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

