import "server-only";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { SupabaseClient } from "@supabase/supabase-js";
import { FTC_NEC_THRESHOLD_USD } from "@/lib/brand-deals/constants";

const TAX_BUCKET = "advocate-tax-documents";

export async function build1099NecPdf(params: {
  payerName: string;
  payerEin: string;
  recipientName: string;
  recipientAddress: string;
  taxYear: number;
  nonemployeeCompensation: number;
}): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const draw = (text: string, x: number, y: number, size = 10, useBold = false) => {
    page.drawText(text, { x, y, size, font: useBold ? bold : font, color: rgb(0, 0, 0) });
  };

  draw("Form 1099-NEC (Summary)", 72, 720, 14, true);
  draw(`Tax year: ${params.taxYear}`, 72, 700);
  draw("PAYER", 72, 670, 11, true);
  draw(params.payerName, 72, 655);
  draw(`EIN: ${params.payerEin}`, 72, 640);
  draw("RECIPIENT", 72, 610, 11, true);
  draw(params.recipientName, 72, 595);
  draw(params.recipientAddress, 72, 580);
  draw(`Box 1 — Nonemployee compensation: $${params.nonemployeeCompensation.toFixed(2)}`, 72, 540, 11, true);
  draw(
    "This is a platform-generated summary for your records. Consult your tax advisor for official filing.",
    72,
    500,
    9,
  );

  return doc.save();
}

export async function generateAdvocate1099ForYear(
  admin: SupabaseClient,
  taxYear: number,
  advocateId?: string,
): Promise<{ generated: number; errors: string[] }> {
  const errors: string[] = [];
  let generated = 0;

  let query = admin
    .from("advocate_annual_earnings")
    .select("advocate_id, gross_earnings")
    .eq("tax_year", taxYear)
    .gte("gross_earnings", FTC_NEC_THRESHOLD_USD);

  if (advocateId) query = query.eq("advocate_id", advocateId);

  const { data: earners, error } = await query;
  if (error) {
    return { generated: 0, errors: [error.message] };
  }

  const payerName = process.env.SIFS_GOLD_LEGAL_NAME ?? "Sif's Gold LLC";
  const payerEin = process.env.SIFS_GOLD_EIN ?? "XX-XXXXXXX";

  for (const row of earners ?? []) {
    const id = row.advocate_id as string;
    const total = Number(row.gross_earnings);

    const { data: existing } = await admin
      .from("advocate_tax_documents")
      .select("id")
      .eq("advocate_id", id)
      .eq("tax_year", taxYear)
      .eq("form_type", "1099-NEC")
      .maybeSingle();

    if (existing) continue;

    const { data: advocate } = await admin
      .from("advocate_profiles")
      .select("display_name")
      .eq("id", id)
      .single();

    const { data: profile } = await admin.from("profiles").select("email, full_name").eq("id", id).single();

    const pdfBytes = await build1099NecPdf({
      payerName,
      payerEin,
      recipientName: (advocate?.display_name as string) ?? (profile?.full_name as string) ?? "Advocate",
      recipientAddress: (profile?.email as string) ?? "",
      taxYear,
      nonemployeeCompensation: total,
    });

    const path = `${taxYear}/${id}/1099-NEC.pdf`;
    const { error: uploadError } = await admin.storage
      .from(TAX_BUCKET)
      .upload(path, pdfBytes, { contentType: "application/pdf", upsert: true });

    if (uploadError) {
      errors.push(`${id}: ${uploadError.message}`);
      continue;
    }

    const { data: urlData } = admin.storage.from(TAX_BUCKET).getPublicUrl(path);
    const fileUrl = urlData.publicUrl;

    await admin.from("advocate_tax_documents").insert({
      advocate_id: id,
      tax_year: taxYear,
      form_type: "1099-NEC",
      total_amount: total,
      file_url: fileUrl,
      delivered_at: new Date().toISOString(),
    });

    await admin
      .from("advocate_annual_earnings")
      .update({ nec_generated: true, nec_generated_at: new Date().toISOString() })
      .eq("advocate_id", id)
      .eq("tax_year", taxYear);

    if (profile?.email) {
      const { sendTemplateEmail } = await import("@/lib/email/send-template");
      await sendTemplateEmail("annual_1099_available", profile.email as string, {
        taxYear,
        downloadUrl: fileUrl,
      });
    }

    generated += 1;
  }

  return { generated, errors };
}
