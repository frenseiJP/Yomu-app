import { redirect } from "next/navigation";

/** Legacy URL: social feed removed; scenario practice lives in Chat. */
export default function CommunityRedirectPage() {
  redirect("/?scenario=today");
}
