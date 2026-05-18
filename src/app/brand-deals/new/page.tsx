import { redirect } from "next/navigation";
import { isBrandUserType } from "@/lib/auth-brand";
import { createClient } from "@/lib/supabase/server";

/** Brand partners create campaigns in the brand dashboard; this route gates access. */
export default async function NewBrandDealPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/sign-in?next=/brand-deals/new");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/brand-deals/new");

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single();

  if (!isBrandUserType(profile?.user_type)) {
    redirect("/for-brands");
  }

  redirect("/dashboard/brand-deals?action=new");
}
