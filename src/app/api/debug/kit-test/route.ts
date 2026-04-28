import { NextResponse } from "next/server";
import { syncEmailToKit } from "@/lib/kit";

export async function GET() {
  const testEmail = `kit-test-${Date.now()}@debug.teriyakiturf.com`;

  const result = await syncEmailToKit(testEmail, "debug-test", {
    zipCode: "64112",
  });

  return NextResponse.json({
    test: "syncEmailToKit (same function signup uses)",
    email: testEmail,
    kitSynced: result,
    envCheck: {
      KIT_FORM_ID_RAW: process.env.KIT_FORM_ID ?? "MISSING",
      KIT_API_KEY: process.env.KIT_API_KEY ? `SET (${process.env.KIT_API_KEY.length} chars)` : "MISSING",
    },
  });
}
