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

export async function submitWaitlist({
  email,
  source,
  userType,
}: WaitlistSubmission): Promise<Web3FormsSubmitResult> {
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

  return {
    ok: true,
    message: "You're in Sif's Circle. Watch your inbox — and welcome.",
  };
}

export async function submitAdvocateApplication(application: AdvocateSubmission) {
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
  return data;
}

export async function submitDeletionRequest({
  fullName,
  email,
  reason,
}: SubmitDeletionRequestInput): Promise<Web3FormsSubmitResult> {
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

  return {
    ok: true,
    message:
      "Your deletion request has been received. We will process it within 30 days and email you when complete. If you change your mind within 30 days, contact us to cancel.",
  };
}

export async function submitNewsletterSignup({
  email,
}: SubmitNewsletterSignupInput): Promise<Web3FormsSubmitResult> {
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

  return {
    ok: true,
    message: "You're in. Look for our first update soon.",
  };
}
