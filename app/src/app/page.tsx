import { redirect } from "next/navigation";

// As proxy.ts/middleware.ts can not be used in Tauri (output is 'output'), we
// have to handle the redirection manually here.
export default function RootPage() {
  redirect("/zh");
}
