import { redirect } from "next/navigation";

export default function ProMessagesRedirect() {
  redirect("/dashboard/messages");
}
