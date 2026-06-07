export function isAdminAuthorized(req: Request): boolean {
  const secret = process.env.ADMIN_ANALYTICS_SECRET?.trim();
  if (!secret) return false;

  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)frensei_admin=([^;]+)/);
  if (match && decodeURIComponent(match[1]) === secret) return true;

  return false;
}
