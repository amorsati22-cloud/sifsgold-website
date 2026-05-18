import { EMAIL_BRAND } from "@/lib/email/constants";

export const emailStyles = {
  h1: {
    margin: "0 0 16px",
    fontFamily: EMAIL_BRAND.fonts.headline,
    fontSize: "28px",
    lineHeight: "1.25",
    fontWeight: 700 as const,
    color: EMAIL_BRAND.colors.cream,
  },
  p: {
    margin: "0 0 16px",
    fontSize: "16px",
    lineHeight: "26px",
    color: EMAIL_BRAND.colors.cream,
  },
  muted: {
    margin: "0 0 16px",
    fontSize: "14px",
    lineHeight: "22px",
    color: `${EMAIL_BRAND.colors.cream}cc`,
  },
  link: {
    color: EMAIL_BRAND.colors.gold,
    textDecoration: "underline",
  },
  button: {
    display: "inline-block",
    marginTop: "8px",
    padding: "14px 28px",
    backgroundColor: EMAIL_BRAND.colors.gold,
    color: EMAIL_BRAND.colors.navy,
    fontSize: "14px",
    fontWeight: 600 as const,
    borderRadius: "8px",
    textDecoration: "none",
  },
  list: {
    margin: "0 0 16px",
    paddingLeft: "20px",
    color: EMAIL_BRAND.colors.cream,
    fontSize: "15px",
    lineHeight: "24px",
  },
};
