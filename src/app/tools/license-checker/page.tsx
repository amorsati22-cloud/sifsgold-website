import { redirect } from "next/navigation";

export default function LicenseCheckerRedirect() {
  redirect("/tools/license-renewal-tracker");
}
