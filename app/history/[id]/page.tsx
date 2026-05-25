import { redirect } from "next/navigation";

/** Legacy `/history/:id` links open the main shell with that session (same storage as chat). */
export default function LegacyHistoryDetailPage({ params }: { params: { id: string } }) {
  redirect(`/?session=${encodeURIComponent(params.id)}`);
}
