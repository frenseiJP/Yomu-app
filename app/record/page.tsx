import { redirect } from "next/navigation";

/**
 * Legacy route.
 * Progress has replaced Record as the main experience.
 */
export default function RecordPage() {
  redirect("/progress");
}
