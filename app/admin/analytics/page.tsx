"use client";

import { useCallback, useEffect, useState } from "react";
import type { AnalyticsSummary } from "@/lib/analytics/queries";

type Range = 7 | 14 | 30;

function pct(part: number, whole: number): string {
  if (!whole) return "—";
  return `${Math.round((part / whole) * 100)}%`;
}

function FunnelBar({ label, value, max }: { label: string; value: number; max: number }) {
  const width = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-medium text-slate-100">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-gradient-to-r from-wa-ruri to-pink-500" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [authed, setAuthed] = useState(false);
  const [secret, setSecret] = useState("");
  const [range, setRange] = useState<Range>(7);
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (days: Range) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/analytics?days=${days}`, { credentials: "include" });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      const json = (await res.json()) as AnalyticsSummary & { error?: string };
      setData(json);
      if (json.error) setError(json.error);
      setAuthed(true);
    } catch {
      setError("データの取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(range);
  }, [load, range]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/analytics", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ secret }),
      });
      if (!res.ok) {
        setError("パスワードが違います。");
        return;
      }
      setAuthed(true);
      await load(range);
    } catch {
      setError("ログインに失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <h1 className="text-lg font-semibold text-slate-100">Frensei Analytics</h1>
          <p className="mt-2 text-sm text-slate-400">運営用ダッシュボード（ADMIN_ANALYTICS_SECRET）</p>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            placeholder="Admin password"
            autoComplete="current-password"
          />
          {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
          <button
            type="submit"
            disabled={loading || !secret}
            className="mt-4 w-full rounded-xl bg-wa-ruri px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Loading…" : "Open dashboard"}
          </button>
        </form>
      </div>
    );
  }

  const funnel = data?.funnel;
  const funnelMax = Math.max(
    funnel?.landing_view ?? 0,
    funnel?.guest_chat_start ?? 0,
    funnel?.chat_send ?? 0,
    1,
  );

  return (
    <div className="min-h-screen bg-[#020617] px-4 py-8 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">ユーザー行動ダッシュボード</h1>
            <p className="mt-1 text-sm text-slate-400">
              アプデ優先度の判断用 — 個人のチャット本文は含みません
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Supabase 未設定時は Google スプレッドシートの Analytics タブにも記録されます
            </p>
          </div>
          <div className="flex gap-2">
            {([7, 14, 30] as Range[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setRange(d)}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  range === d ? "bg-wa-ruri text-white" : "bg-slate-800 text-slate-300"
                }`}
              >
                {d}日
              </button>
            ))}
          </div>
        </header>

        {error ? (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-950/40 px-4 py-3 text-sm text-amber-100">
            {error}
          </div>
        ) : null}

        {loading && !data ? (
          <p className="text-slate-400">読み込み中…</p>
        ) : data ? (
          <div className="grid gap-6">
            <section className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "イベント総数", value: data.totals.events },
                { label: "ユニークユーザー（推定）", value: data.totals.uniqueUsers },
                { label: "登録ユーザー（Supabase）", value: data.totals.registeredUsers ?? "—" },
              ].map((card) => (
                <div key={card.label} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{card.label}</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
                  </p>
                </div>
              ))}
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">集客ファネル</h2>
              <div className="mt-4 space-y-3">
                <FunnelBar label="LP閲覧 (landing_view)" value={funnel?.landing_view ?? 0} max={funnelMax} />
                <FunnelBar label="お試し開始 (guest_chat_start)" value={funnel?.guest_chat_start ?? 0} max={funnelMax} />
                <FunnelBar
                  label={`お試し継続 (guest_chat_turn) — LP比 ${pct(funnel?.guest_chat_turn ?? 0, funnel?.landing_view ?? 0)}`}
                  value={funnel?.guest_chat_turn ?? 0}
                  max={funnelMax}
                />
                <FunnelBar label="登録CTAクリック" value={funnel?.signup_cta_click ?? 0} max={funnelMax} />
                <FunnelBar label="ログイン成功" value={funnel?.login_success ?? 0} max={funnelMax} />
                <FunnelBar label="チャット送信 (chat_send)" value={funnel?.chat_send ?? 0} max={funnelMax} />
                <FunnelBar label="語彙保存" value={funnel?.vocabulary_save ?? 0} max={funnelMax} />
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">タブ利用 (shell_view)</h2>
                <ul className="mt-3 space-y-2">
                  {data.tabUsage.length === 0 ? (
                    <li className="text-sm text-slate-500">データなし</li>
                  ) : (
                    data.tabUsage.map((t) => (
                      <li key={t.tab} className="flex justify-between text-sm">
                        <span className="text-slate-300">{t.tab}</span>
                        <span className="text-slate-100">{t.count}</span>
                      </li>
                    ))
                  )}
                </ul>
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">チュートリアル</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex justify-between"><span>表示</span><span>{data.tutorial.shown}</span></li>
                  <li className="flex justify-between"><span>開始</span><span>{data.tutorial.started}</span></li>
                  <li className="flex justify-between"><span>完了</span><span>{data.tutorial.completed}</span></li>
                  <li className="flex justify-between"><span>スキップ</span><span>{data.tutorial.skipped}</span></li>
                </ul>
              </section>
            </div>

            <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">イベント内訳（上位）</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="pb-2 pr-4">イベント</th>
                      <th className="pb-2 pr-4">回数</th>
                      <th className="pb-2">UU（ログ内）</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.eventBreakdown.slice(0, 15).map((row) => (
                      <tr key={row.event_type} className="border-t border-slate-800/80">
                        <td className="py-2 pr-4 font-mono text-xs text-pink-200/90">{row.event_type}</td>
                        <td className="py-2 pr-4">{row.count}</td>
                        <td className="py-2">{row.unique_users}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">人気ページ</h2>
              <ul className="mt-3 space-y-2">
                {data.topRoutes.map((r) => (
                  <li key={r.route} className="flex justify-between text-sm">
                    <span className="font-mono text-slate-300">{r.route}</span>
                    <span>{r.count}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">最近のフィードバック</h2>
              <ul className="mt-3 space-y-3">
                {data.recentFeedback.length === 0 ? (
                  <li className="text-sm text-slate-500">なし</li>
                ) : (
                  data.recentFeedback.map((f) => (
                    <li key={`${f.created_at}-${f.user_id}`} className="rounded-xl border border-slate-800/80 p-3 text-sm">
                      <p className="text-xs text-slate-500">
                        {new Date(f.created_at).toLocaleString("ja-JP")} · {f.display_name ?? f.user_id.slice(0, 12)}
                      </p>
                      <p className="mt-1 text-slate-200">{f.body}</p>
                    </li>
                  ))
                )}
              </ul>
            </section>

            <p className="text-xs text-slate-600">
              更新: {new Date(data.generatedAt).toLocaleString("ja-JP")} · チャット本文は端末内のみ（サーバー非保存）
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
