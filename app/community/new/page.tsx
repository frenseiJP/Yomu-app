import { redirect } from "next/navigation";

export default function CommunityNewRedirectPage() {
  redirect("/app?scenario=today");
}
