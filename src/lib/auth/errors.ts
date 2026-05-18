export function getAuthErrorMessage(error: { message?: string; code?: string } | null): string {
  if (!error?.message) {
    return "Something went wrong. Please try again.";
  }

  const message = error.message.toLowerCase();
  const code = error.code?.toLowerCase() ?? "";

  if (message.includes("invalid login credentials") || code === "invalid_credentials") {
    return "Incorrect email or password.";
  }

  if (message.includes("email not confirmed") || code === "email_not_confirmed") {
    return "Please verify your email before signing in. Check your inbox for the confirmation link.";
  }

  if (message.includes("user already registered") || code === "user_already_exists") {
    return "An account with this email already exists. Sign in or reset your password.";
  }

  if (message.includes("password") && message.includes("weak")) {
    return "Choose a stronger password — at least 8 characters with mixed character types.";
  }

  if (message.includes("rate limit") || code === "over_request_rate_limit") {
    return "Too many attempts. Please wait a few minutes and try again.";
  }

  if (message.includes("signup is disabled")) {
    return "Sign up is temporarily unavailable. Join Sif's Circle on the homepage while we finish setup.";
  }

  return error.message;
}
