/**
 * Server-side Kit (ConvertKit) email sync.
 * Kit failure must NEVER throw to the caller — account creation
 * always proceeds regardless of Kit availability.
 */

const RAW_FORM_ID = process.env.KIT_FORM_ID ?? "";
const KIT_FORM_ID = RAW_FORM_ID.match(/(\d+)/)?.[1] ?? "";
const KIT_API_KEY = process.env.KIT_API_KEY;
// Optional: skip the name→id lookup if the tag id is known up front.
const KIT_FERTILIZER_TAG_ID = process.env.KIT_FERTILIZER_TAG_ID?.match(/(\d+)/)?.[1];

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

/**
 * Resolve a Kit tag id from its name. Prefers the KIT_FERTILIZER_TAG_ID env
 * override; otherwise looks the tag up by name via the v3 tags list.
 * Returns null on any failure (caller treats Kit as best-effort).
 */
async function resolveTagId(tagName: string): Promise<string | null> {
  if (KIT_FERTILIZER_TAG_ID) return KIT_FERTILIZER_TAG_ID;

  const res = await fetch(
    `https://api.convertkit.com/v3/tags?api_key=${encodeURIComponent(KIT_API_KEY!)}`
  );
  if (!res.ok) {
    console.error(`Kit tag lookup failed: ${res.status} ${await res.text()}`);
    return null;
  }
  const data = (await res.json()) as { tags?: Array<{ id: number; name: string }> };
  const tag = data.tags?.find(
    (t) => t.name?.toLowerCase() === tagName.toLowerCase()
  );
  if (!tag) {
    console.error(`Kit tag "${tagName}" not found`);
    return null;
  }
  return String(tag.id);
}

/**
 * Add a Kit tag to a subscriber by email. Creates the subscriber if they
 * aren't already in Kit. Like syncEmailToKit, this NEVER throws — a Kit
 * outage must not break the waitlist submission.
 */
export async function addTagToKit(
  email: string,
  tagName: string
): Promise<boolean> {
  try {
    if (!KIT_API_KEY) {
      console.warn("Kit env vars missing — skipping tag sync");
      return false;
    }

    const tagId = await resolveTagId(tagName);
    if (!tagId) return false;

    const res = await fetch(
      `https://api.convertkit.com/v3/tags/${tagId}/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: KIT_API_KEY, email }),
      }
    );

    if (!res.ok) {
      console.error(
        `Kit tag "${tagName}" failed for ${email}: ${res.status} ${await res.text()}`
      );
      return false;
    }

    return true;
  } catch (err) {
    console.error(`Kit tag error for ${email}:`, err);
    return false;
  }
}
