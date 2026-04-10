/**
 * Server-side Kit (ConvertKit) email sync.
 * Kit failure must NEVER throw to the caller — account creation
 * always proceeds regardless of Kit availability.
 */

const KIT_FORM_ID = process.env.KIT_FORM_ID || "9310262";
const KIT_API_KEY = process.env.KIT_API_KEY || "7-a1C3cqbRDSzdf6uv6Plw";

export async function syncEmailToKit(
  email: string,
  entryPoint: string,
  fields?: { zipCode?: string; lawnSqft?: number }
): Promise<boolean> {
  try {
    const customFields: Record<string, string> = {};
    if (fields?.zipCode) customFields.zip_code = fields.zipCode;
    if (fields?.lawnSqft) customFields.lawn_sqft = String(fields.lawnSqft);

    const res = await fetch(
      `https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: KIT_API_KEY,
          email,
          fields: customFields,
          tags: [entryPoint],
        }),
      }
    );

    if (!res.ok) {
      console.error(`Kit sync failed for ${email}:`, await res.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error(`Kit sync error for ${email}:`, err);
    // Do not rethrow — account creation proceeds
    return false;
  }
}
