import { redirect } from "next/navigation";

/** Legacy /topic URL — scenario practice lives in Chat. */
export default function TopicPage() {
  redirect("/app?scenario=today");
}
