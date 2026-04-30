import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
) {
  const baseUrl =
    process.env.NEXTAUTH_URL || "https://teriyakiturf.com";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  const resend = getResend();

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "hello@teriyakiturf.com",
    to: email,
    subject: "Reset your Teriyaki Turf password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <h1 style="font-size: 24px; color: #1B4332; margin: 0 0 16px;">
          Reset Your Password
        </h1>
        <p style="font-size: 14px; color: #6B7B70; line-height: 1.6; margin: 0 0 24px;">
          We received a request to reset your Teriyaki Turf password.
          Click the button below to choose a new one. This link expires in 1 hour.
        </p>
        <a href="${resetUrl}" style="
          display: inline-block;
          background: #52B788;
          color: white;
          text-decoration: none;
          padding: 12px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
        ">
          Reset Password
        </a>
        <p style="font-size: 12px; color: #6B7B70; margin: 24px 0 0; line-height: 1.5;">
          If you didn't request this, you can safely ignore this email.
          Your password won't change until you click the link above.
        </p>
        <hr style="border: none; border-top: 1px solid #D6E8DC; margin: 24px 0;" />
        <p style="font-size: 11px; color: #9CA3AF;">
          Teriyaki Turf -- KC Lawn Care
        </p>
      </div>
    `,
  });
}
