import { redirect } from "next/navigation";

/** /app redirects to main app at / */
export default function AppRedirect() {
  redirect("/");
}
