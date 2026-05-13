/** Web3Forms public access keys (NEXT_PUBLIC_* are inlined at build time). */
export const web3formsWaitlistAccessKey =
  process.env.NEXT_PUBLIC_WEB3FORMS_WAITLIST ?? "31e29b26-890f-47e3-bf6f-2c41ada33b6b";

export const web3formsAmbassadorAccessKey =
  process.env.NEXT_PUBLIC_WEB3FORMS_AMBASSADOR ?? "81476d95-3f7c-4f37-855b-bf4fba5b6cdb";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export type Web3FormsSubmitResult = {
  ok: boolean;
  message: string;
};

export type SubmitWaitlistInput = {
  email: string;
  source?: string;
};

export async function submitWaitlist({
  email,
  source = "homepage_waitlist",
}: SubmitWaitlistInput): Promise<Web3FormsSubmitResult> {
  console.warn(
    "Web3Forms recipient not yet configured — will be replaced with hello@sifsgold.com when Fastmail is set up.",
  );

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: web3formsWaitlistAccessKey,
      email,
      source,
    }),
  });

  const data = (await response.json().catch(() => null)) as
    | { success?: boolean; message?: string }
    | null;

  if (!response.ok || !data?.success) {
    return {
      ok: false,
      message: data?.message || "We couldn't add you right now. Please try again.",
    };
  }

  return {
    ok: true,
    message: "You're in Sif's Circle. Watch your inbox — and welcome.",
  };
}
