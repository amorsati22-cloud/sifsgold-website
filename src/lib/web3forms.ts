const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const WAITLIST_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_WAITLIST_KEY;
const ADVOCATE_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ADVOCATE_KEY;

/** Exposed for static HTML forms that pass the key as a hidden field. */
export const web3formsWaitlistAccessKey = WAITLIST_KEY ?? "";

export type Web3FormsSubmitResult = {
  ok: boolean;
  message: string;
};

export type WaitlistSubmission = {
  email: string;
  source: string;
  userType?: string;
};

export type AdvocateSubmission = {
  name: string;
  email: string;
  socialHandles: string;
  specialty: string;
  sampleContent: string;
  licenseStatus: string;
  reason: string;
};

export type SubmitDeletionRequestInput = {
  fullName: string;
  email: string;
  reason?: string;
};

export type SubmitNewsletterSignupInput = {
  email: string;
};

export type Web3FormsSubmitOptions = {
  /** Called after Web3Forms accepts the submission (before optional email trigger). */
  onSuccess?: () => void | Promise<void>;
  /** When true (default), fire transactional email via /api/email/send after success. */
  triggerEmail?: boolean;
};

async function afterSuccessfulSubmit(
  options: Web3FormsSubmitOptions | undefined,
  emailTrigger?: { source: string; email: string; name?: string; reason?: string },
) {
  if (options?.onSuccess) {
    await options.onSuccess();
  }

  if (options?.triggerEmail !== false && emailTrigger) {
    const { triggerTransactionalEmail, resolveClientTemplateFromSource } = await import(
      "@/lib/email/trigger-client"
    );
    const type = resolveClientTemplateFromSource(emailTrigger.source);
    await triggerTransactionalEmail(type, emailTrigger.email, {
      name: emailTrigger.name,
      reason: emailTrigger.reason,
      source: emailTrigger.source,
    });
  }
}

export async function submitWaitlist(
  { email, source, userType }: WaitlistSubmission,
  options?: Web3FormsSubmitOptions,
): Promise<Web3FormsSubmitResult> {
  if (!WAITLIST_KEY) {
    return {
      ok: false,
      message: "Waitlist key missing — set NEXT_PUBLIC_WEB3FORMS_WAITLIST_KEY in env",
    };
  }

  const formData = new FormData();
  formData.append("access_key", WAITLIST_KEY);
  formData.append("email", email);
  formData.append("source", source);
  if (userType) formData.append("userType", userType);
  formData.append("subject", `New Sif's Circle signup — ${source}`);
  formData.append("from_name", "Sif's Circle");
  formData.append("botcheck", "");

  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;

  if (!data?.success) {
    return {
      ok: false,
      message: data?.message || "Submission failed",
    };
  }

  await afterSuccessfulSubmit(options, { source, email });

  try {
    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source, userType }),
    });
  } catch {
    // Web3Forms succeeded; Supabase persistence is best-effort from the client.
  }

  return {
    ok: true,
    message: "You're in Sif's Circle. Watch your inbox — and welcome.",
  };
}

export async function submitAdvocateApplication(
  application: AdvocateSubmission,
  options?: Web3FormsSubmitOptions,
) {
  if (!ADVOCATE_KEY) {
    throw new Error("Advocate key missing — set NEXT_PUBLIC_WEB3FORMS_ADVOCATE_KEY in env");
  }

  const formData = new FormData();
  formData.append("access_key", ADVOCATE_KEY);
  Object.entries(application).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append("source", "sifs_advocate_application");
  formData.append("subject", `New Sif's Advocate application — ${application.name}`);
  formData.append("from_name", "Sif's Advocate Applications");
  formData.append("botcheck", "");

  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;

  if (!data?.success) {
    throw new Error(data?.message || "Submission failed");
  }

  await afterSuccessfulSubmit(options, {
    source: "sifs_advocate_application",
    email: application.email,
    name: application.name,
  });

  try {
    await fetch("/api/advocate-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: application.name,
        email: application.email,
        socialHandles: application.socialHandles,
        specialty: application.specialty,
        sampleContent: application.sampleContent,
        licenseStatus: application.licenseStatus,
        reason: application.reason,
      }),
    });
  } catch {
    // Web3Forms succeeded; Supabase persistence is best-effort from the client.
  }

  return data;
}

export async function submitDeletionRequest(
  { fullName, email, reason }: SubmitDeletionRequestInput,
  options?: Web3FormsSubmitOptions,
): Promise<Web3FormsSubmitResult> {
  if (!WAITLIST_KEY) {
    return {
      ok: false,
      message: "Waitlist key missing — set NEXT_PUBLIC_WEB3FORMS_WAITLIST_KEY in env",
    };
  }

  const formData = new FormData();
  formData.append("access_key", WAITLIST_KEY);
  formData.append("email", email);
  formData.append("full_name", fullName);
  formData.append("reason", reason?.trim() || "No reason provided");
  formData.append("confirmation", "I understand this is permanent and cannot be undone.");
  formData.append("source", "account_deletion_request");
  formData.append("page_url", "https://sifsgold.com/delete");
  formData.append("subject", `ACCOUNT DELETION REQUEST — ${email}`);
  formData.append("from_name", "Account Deletion");
  formData.append("botcheck", "");

  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;

  if (!data?.success) {
    return {
      ok: false,
      message:
        data?.message ||
        "We couldn't submit your deletion request right now. Please try again.",
    };
  }

  await afterSuccessfulSubmit(options, {
    source: "account_deletion_request",
    email,
    name: fullName,
  });

  return {
    ok: true,
    message:
      "Your deletion request has been received. We will process it within 30 days and email you when complete. If you change your mind within 30 days, contact us to cancel.",
  };
}

export async function submitNewsletterSignup(
  { email }: SubmitNewsletterSignupInput,
  options?: Web3FormsSubmitOptions,
): Promise<Web3FormsSubmitResult> {
  if (!WAITLIST_KEY) {
    return {
      ok: false,
      message: "Waitlist key missing — set NEXT_PUBLIC_WEB3FORMS_WAITLIST_KEY in env",
    };
  }

  const formData = new FormData();
  formData.append("access_key", WAITLIST_KEY);
  formData.append("email", email);
  formData.append("source", "newsletter_signup");
  formData.append("subject", "NEWSLETTER SIGNUP");
  formData.append("from_name", "Newsletter");
  formData.append("botcheck", "");

  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;

  if (!data?.success) {
    return {
      ok: false,
      message: data?.message || "We couldn't subscribe you right now. Please try again.",
    };
  }

  await afterSuccessfulSubmit(options, { source: "newsletter_signup", email });

  return {
    ok: true,
    message: "You're in. Look for our first update soon.",
  };
}
