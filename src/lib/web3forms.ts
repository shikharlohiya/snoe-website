// Shared Web3Forms submission wrapper for both lead forms.
//
// Setup: create a free access key at https://web3forms.com
// (leads are emailed to the address you register there), then
// set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY in .env.local.
// The key is public by design — spam is mitigated by the
// honeypot field plus Web3Forms' own filtering.

const ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "YOUR-WEB3FORMS-ACCESS-KEY";

export function isWeb3FormsConfigured(): boolean {
  return ACCESS_KEY !== "YOUR-WEB3FORMS-ACCESS-KEY";
}

export async function submitLead(
  payload: Record<string, string>
): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        from_name: "SNOE Website",
        ...payload,
      }),
    });
    const data = await res.json();
    return {
      ok: res.ok && data.success === true,
      message: typeof data.message === "string" ? data.message : "",
    };
  } catch {
    return { ok: false, message: "Network error — please try again." };
  }
}
