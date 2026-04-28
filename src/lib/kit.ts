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
    const payload = {
      api_key: KIT_API_KEY,
      email,
      fields: customFields,
    };

    console.log("Kit sync request:", { url, email, formId: KIT_FORM_ID, fields: customFields });

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseText = await res.text();
    console.log("Kit sync response:", { status: res.status, body: responseText });

    if (!res.ok) {
      console.error(`Kit sync failed for ${email}: ${res.status} ${responseText}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error(`Kit sync error for ${email}:`, err);
    // Do not rethrow — account creation proceeds
    return false;
  }
}
