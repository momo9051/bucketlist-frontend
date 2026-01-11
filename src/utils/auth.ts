import type { User } from "oidc-client-ts";

export const getDisplayName = (profile: User["profile"] | undefined): string => {
  if (!profile) return "Onbekende gebruiker";

  const record = profile as Record<string, string | undefined>;
  const name = record.name;
  const preferred = record.preferred_username;
  const email = record.email;
  const sub = record.sub;

  if (name) return name;
  if (preferred) return preferred;
  if (email) return email;
  if (sub) return sub.length > 12 ? `${sub.slice(0, 8)}…` : sub;
  return "Onbekende gebruiker";
};
