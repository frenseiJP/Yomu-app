import { permanentRedirect } from "next/navigation";

/** Legacy /home URLs → main app shell */
export default function HomeRedirectPage() {
  permanentRedirect("/app");
}
