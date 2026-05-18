import { render } from "@react-email/render";
import { NextResponse } from "next/server";
import {
  EMAIL_TEMPLATE_TYPES,
  type EmailTemplateType,
  getTemplatePreview,
} from "@/lib/email/send-template";
import { parseEmailToken } from "@/lib/email/signing";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const template = searchParams.get("template") as EmailTemplateType | null;
  const token = searchParams.get("token");

  if (!template || !EMAIL_TEMPLATE_TYPES.includes(template)) {
    return new NextResponse("Invalid template", { status: 400 });
  }

  let email = "member@sifsgold.com";

  if (token) {
    const payload = parseEmailToken(token);
    if (!payload || payload.purpose !== "view") {
      return new NextResponse("Invalid or expired link", { status: 403 });
    }
    email = payload.email;
  } else if (process.env.NODE_ENV === "production") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const built = getTemplatePreview(template, email);
  const html = await render(built.react);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}
