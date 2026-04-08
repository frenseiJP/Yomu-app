/**
 * レイアウトに固定アフィリエイトバーを出すルートか。
 * /chat ではバーを出さない（AffiliateShell と揃える）。
 */
export function isAffiliateBarVisibleForPath(pathname: string | null | undefined): boolean {
  return false;
}
