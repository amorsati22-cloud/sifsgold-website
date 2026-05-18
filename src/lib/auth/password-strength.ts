export type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: "Too weak" | "Weak" | "Fair" | "Good" | "Strong";
  percent: number;
};

export function measurePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: "Too weak", percent: 0 };
  }

  let points = 0;
  if (password.length >= 8) points += 1;
  if (password.length >= 12) points += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points += 1;
  if (/\d/.test(password)) points += 1;
  if (/[^A-Za-z0-9]/.test(password)) points += 1;

  const score = Math.min(4, Math.max(0, points - 1)) as PasswordStrength["score"];
  const labels: PasswordStrength["label"][] = ["Too weak", "Weak", "Fair", "Good", "Strong"];
  return {
    score,
    label: labels[score],
    percent: (score / 4) * 100,
  };
}
