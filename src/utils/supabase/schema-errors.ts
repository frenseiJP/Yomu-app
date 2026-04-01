/**
 * PostgREST がテーブルを見つけられないとき（未作成・キャッシュ未反映など）
 */
export function isMissingTableError(error: unknown, tableName: string): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: string; message?: string };
  const msg = String(e.message ?? "");
  const names =
    msg.includes(tableName) || msg.includes(`public.${tableName}`);
  if (e.code === "PGRST205" && names) return true;
  if (!msg.includes("schema cache")) return false;
  return names;
}
