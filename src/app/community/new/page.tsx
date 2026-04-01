import { redirect } from "next/navigation";
import { Target } from "lucide-react";
import { createClient } from "@/src/utils/supabase/server";
import { getLangServer } from "@/src/utils/i18n/serverLang";
import { t } from "@/src/utils/i18n/t";

type DailyPrompt = {
  id: string;
  title_jp: string;
  title_en?: string | null;
};

export default async function CommunityNewPage({
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

  const { data: promptsData } = await supabase
    .from("prompts")
    .select("id, title_jp, title_en")
    .order("scheduled_date", { ascending: false })
    .limit(50);

  const prompts: DailyPrompt[] = (promptsData ?? []).map((p: any) => ({
    id: String(p.id),
    title_jp: String(p.title_jp ?? ""),
    title_en: p.title_en ?? null,
  }));

  const initialPromptIdParam = searchParams?.promptId;
  const initialPromptId =
    typeof initialPromptIdParam === "string" ? initialPromptIdParam : undefined;

  async function createPost(formData: FormData) {
    "use server";

    const supabaseForAction = await createClient();
    const {
      data: { user: currentUser },
    } = await supabaseForAction.auth.getUser();
    if (!currentUser) {
      redirect("/login");
    }

    const promptId = formData.get("promptId");
    const contentJp = String(formData.get("content_jp") ?? "").trim();
    const contentEn = String(formData.get("content_en") ?? "").trim();

    if (!promptId || !contentJp) {
      redirect("/community/new");
    }

    await supabaseForAction.from("posts").insert([
      {
        prompt_id: promptId,
        content_jp: contentJp,
        content_en: contentEn,
      },
    ]);

    redirect("/community");
  }

  return (
    <div
      className="min-h-screen bg-yomu-bg text-slate-100 antialiased"
      style={{ background: "#020617" }}
    >
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6">
          <h1 className="font-wa-serif text-lg font-semibold text-slate-50 sm:text-xl">
            {t(lang, "newPostTitle")}
          </h1>
          <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
            Pick a prompt and write your Japanese expression. Add an English line too if you like.
          </p>
        </header>

        <section className="space-y-4 rounded-3xl border border-slate-800/80 bg-slate-950/90 p-4 shadow-[0_22px_80px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-5">
          <form action={createPost} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="promptId"
                className="text-[11px] font-medium text-slate-300"
              >
                {t(lang, "choosePromptLabel")}
              </label>
              <div className="relative">
                <Target className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <select
                  id="promptId"
                  name="promptId"
                  defaultValue={initialPromptId}
                  className="w-full appearance-none rounded-2xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-3 text-[13px] text-slate-100 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60"
                  required
                >
                  <option value="" disabled>
                    Select a prompt
                  </option>
                  {prompts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title_en || p.title_jp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="content_jp"
                className="text-[11px] font-medium text-slate-300"
              >
                {t(lang, "japaneseRequired")}
              </label>
              <textarea
                id="content_jp"
                name="content_jp"
                rows={4}
                required
                className="w-full resize-none rounded-2xl border border-slate-800 bg-slate-950/75 px-3 py-2.5 text-[13px] text-slate-100 placeholder:text-slate-500 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60"
                placeholder="e.g. 本日はお時間いただきありがとうございます。本日のゴールを、最初にすり合わせさせてください。"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="content_en"
                className="text-[11px] font-medium text-slate-300"
              >
                {t(lang, "englishOptional")}
              </label>
              <textarea
                id="content_en"
                name="content_en"
                rows={3}
                className="w-full resize-none rounded-2xl border border-slate-800 bg-slate-950/75 px-3 py-2.5 text-[13px] text-slate-100 placeholder:text-slate-500 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60"
                placeholder="Optional: English translation or explanation of your Japanese sentence."
              />
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="btn-wa-hover btn-wa-hover-ruri inline-flex items-center gap-2 rounded-xl bg-wa-ruri px-4 py-2.5 text-[12px] font-medium text-slate-50 shadow-glass hover:bg-wa-asagi"
              >
                {t(lang, "submitButton")}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

