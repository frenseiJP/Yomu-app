import { NextResponse } from "next/server";
import { createClient } from "@/src/utils/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(req: Request): Promise<Response> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const admin = createServiceRoleClient();
  const { error: uploadError } = await admin.storage.from("avatars").upload(path, buffer, {
    upsert: true,
    contentType: file.type,
  });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 502 });
  }

  const { data } = admin.storage.from("avatars").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
