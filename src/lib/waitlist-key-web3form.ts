import type { Web3FormsSubmitResult, Web3FormsSubmitOptions } from "@/lib/web3forms";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

function getWaitlistKey(): string | undefined {
  return process.env.NEXT_PUBLIC_WEB3FORMS_WAITLIST_KEY;
}

/**
 * Submit arbitrary fields through Web3Forms using the public waitlist access key
 * (same key as waitlist signups — suitable until a dedicated inbox key is configured).
 */
export async function submitWeb3WithWaitlistKey(
  fields: Record<string, string>,
  options: { subject: string; fromName?: string },
  submitOptions?: Web3FormsSubmitOptions,
): Promise<Web3FormsSubmitResult> {
  const accessKey = getWaitlistKey();
  if (!accessKey) {
    return {
      ok: false,
      message: "Form key missing — set NEXT_PUBLIC_WEB3FORMS_WAITLIST_KEY in env",
    };
  }

  const formData = new FormData();
  formData.append("access_key", accessKey);
  formData.append("subject", options.subject);
  if (options.fromName) {
    formData.append("from_name", options.fromName);
  }
  formData.append("botcheck", "");

  Object.entries(fields).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      formData.append(k, v);
    }
  });

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

  const email = fields.email?.trim();
  const source = fields.source ?? "contact_form";

  if (email) {
    const { triggerTransactionalEmail, resolveClientTemplateFromSource } = await import(
      "@/lib/email/trigger-client"
    );
    if (submitOptions?.onSuccess) {
      await submitOptions.onSuccess();
    }
    if (submitOptions?.triggerEmail !== false) {
      const type = resolveClientTemplateFromSource(source);
      await triggerTransactionalEmail(type, email, {
        name: fields.name,
        reason: fields.reason,
        source,
      });
    }
  } else if (submitOptions?.onSuccess) {
    await submitOptions.onSuccess();
  }

  return {
    ok: true,
    message: "Thanks. We'll respond within 2 business days.",
  };
}
