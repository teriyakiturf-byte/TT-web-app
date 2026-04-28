/**
 * Server-side Kit (ConvertKit) email sync.
 * Kit failure must NEVER throw to the caller — account creation
 * always proceeds regardless of Kit availability.
 */

const RAW_FORM_ID = process.env.KIT_FORM_ID ?? "";
const KIT_FORM_ID = RAW_FORM_ID.match(/(\d+)/)?.[1] ?? "";
const KIT_API_KEY = process.env.KIT_API_KEY;

export async function syncEmailToKit(
  email: string,
  entryPoint: string,
  fields?: { zipCode?: string; lawnSqft?: number }
): Promise<boolean> {
  try {
    if (!KIT_FORM_ID || !KIT_API_KEY) {
      console.warn("Kit env vars missing — skipping email sync");
      return false;
    }

    const customFields: Record<string, string> = {};
    if (fields?.zipCode) customFields.zip_code = fields.zipCode;
    if (fields?.lawnSqft) customFields.lawn_sqft = String(fields.lawnSqft);
    if (entryPoint) customFields.entry_point = entryPoint;

    const url = `https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: KIT_API_KEY,
        email,
        fields: customFields,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Kit sync failed for ${email}: ${res.status} ${body}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error(`Kit sync error for ${email}:`, err);
    // Do not rethrow — account creation proceeds
    return false;
  }
}
