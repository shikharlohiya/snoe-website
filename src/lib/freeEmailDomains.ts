// Client-side courtesy filter for "company email" fields.
// This is lead-quality UX, not security — anyone can bypass it.

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.in",
  "yahoo.co.uk",
  "ymail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "gmx.com",
  "gmx.de",
  "gmx.net",
  "mail.com",
  "zoho.com",
  "zohomail.com",
  "yandex.com",
  "yandex.ru",
  "rediffmail.com",
  "qq.com",
  "163.com",
  "126.com",
  "tutanota.com",
  "tuta.io",
  "hey.com",
  "fastmail.com",
  "duck.com",
  "mail.ru",
]);

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_SHAPE.test(email.trim());
}

/** Valid email whose domain is not a known free-mail provider. */
export function isCompanyEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  if (!EMAIL_SHAPE.test(trimmed)) return false;
  const domain = trimmed.split("@")[1];
  return !FREE_EMAIL_DOMAINS.has(domain);
}
