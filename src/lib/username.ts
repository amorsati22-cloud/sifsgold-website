import { isReservedUsername } from "@/lib/reserved-usernames";

const USERNAME_REGEX = /^[a-z][a-z0-9._]{1,28}[a-z0-9]$/;

export type UsernameValidationResult =
  | { valid: true; username: string }
  | { valid: false; error: string };

export function normalizeUsername(input: string): string {
  return input.trim().toLowerCase();
}

export function validateUsername(input: string): UsernameValidationResult {
  const username = normalizeUsername(input);

  if (username.length < 3 || username.length > 30) {
    return { valid: false, error: "Username must be 3–30 characters." };
  }

  if (!USERNAME_REGEX.test(username)) {
    return {
      valid: false,
      error:
        "Use lowercase letters, numbers, dots, and underscores. Must start with a letter and cannot start or end with dots or underscores.",
    };
  }

  if (/^[0-9]/.test(username)) {
    return { valid: false, error: "Username cannot start with a number." };
  }

  if (username.startsWith(".") || username.startsWith("_") || username.endsWith(".") || username.endsWith("_")) {
    return { valid: false, error: "Username cannot start or end with a dot or underscore." };
  }

  if (isReservedUsername(username)) {
    return { valid: false, error: "This username is reserved." };
  }

  return { valid: true, username };
}
