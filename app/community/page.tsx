import { redirect } from "next/navigation";

/** Legacy URL: social feed removed; Topic-guided learning lives under /topic. */
export default function CommunityRedirectPage() {
  redirect("/topic");
}
