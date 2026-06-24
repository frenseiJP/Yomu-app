"use client";

import { useRef, useState } from "react";
import { User } from "lucide-react";
import {
  PROFILE_ICON_DEFAULT,
  isProfilePhotoUrl,
  normalizeProfileIcon,
} from "@/lib/profile/icon";

type Props = {
  name?: string;
  initialIcon?: string | null;
  choosePhotoLabel: string;
  defaultHintLabel: string;
  uploadingLabel: string;
  uploadErrorLabel: string;
};

export default function ProfileAvatarField({
  name = "icon",
  initialIcon,
  choosePhotoLabel,
  defaultHintLabel,
  uploadingLabel,
  uploadErrorLabel,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const normalized = normalizeProfileIcon(initialIcon);
  const [iconValue, setIconValue] = useState(normalized);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    isProfilePhotoUrl(normalized) ? normalized : null,
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showPhoto = Boolean(previewUrl);

  async function onFileChange(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(uploadErrorLabel);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(uploadErrorLabel);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/profile/avatar", { method: "POST", body: form });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || "upload failed");

      setPreviewUrl(data.url);
      setIconValue(data.url);
    } catch {
      setError(uploadErrorLabel);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={iconValue} />
      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-800/80"
          aria-hidden
        >
          {showPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl!} alt="" className="h-full w-full object-cover" />
          ) : (
            <User className="h-8 w-8 text-slate-400" strokeWidth={1.5} />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-[12px] font-medium text-slate-200 transition hover:border-wa-ruri/50 hover:bg-slate-800/80 disabled:opacity-50"
          >
            {uploading ? uploadingLabel : choosePhotoLabel}
          </button>
          <p className="text-[11px] text-slate-500">{defaultHintLabel}</p>
          {error ? <p className="text-[11px] text-red-400">{error}</p> : null}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => void onFileChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
