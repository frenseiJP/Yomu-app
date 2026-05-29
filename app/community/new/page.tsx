import { redirect } from "next/navigation";

export default function CommunityNewRedirectPage() {
  redirect("/?scenario=today");
}
