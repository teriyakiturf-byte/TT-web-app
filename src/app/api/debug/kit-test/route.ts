import { NextResponse } from "next/server";

export async function GET() {
  const RAW_FORM_ID = process.env.KIT_FORM_ID ?? "";
  const KIT_FORM_ID = RAW_FORM_ID.match(/(\d+)/)?.[1] ?? "";
  const KIT_API_KEY = process.env.KIT_API_KEY;

  if (!KIT_FORM_ID || !KIT_API_KEY) {
    return NextResponse.json({
      error: "ENV_MISSING",
      raw: RAW_FORM_ID,
      parsed: KIT_FORM_ID || "NONE",
      KIT_API_KEY: KIT_API_KEY ? "SET" : "MISSING",
    });
  }

  const testEmail = `kit-test-${Date.now()}@debug.teriyakiturf.com`;
  const url = `https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`;
  const payload = {
    api_key: KIT_API_KEY,
    email: testEmail,
    fields: { entry_point: "debug-test" },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await res.text();

    return NextResponse.json({
      status: res.status,
      url,
      formId: KIT_FORM_ID,
      testEmail,
      response: body,
    });
  } catch (err) {
    return NextResponse.json({
      error: "FETCH_FAILED",
      message: String(err),
    });
  }
}
