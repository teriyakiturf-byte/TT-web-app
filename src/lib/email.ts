import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

export interface TaskReminderEmailInput {
  to: string;
  firstName: string;
  userCity: string;
  taskName: string;
  taskPlainDescription: string;
  windowOpenDate: string;
  windowCloseDate: string;
  productName: string;
  /** Pre-formatted quantity string, e.g. "12.3 lbs" or null for no-product tasks. */
  quantity: string | null;
  /** Current soil temp in °F, or null if the live reading was unavailable. */
  soilTemp: number | null;
}

/**
 * Send a personalized weekly task-reminder email via Resend.
 *
 * Resend is the established transactional provider in this app (see
 * sendPasswordResetEmail). Kit is used only for list capture, which can't
 * deliver per-user dynamic content, so reminders go through Resend.
 */
export async function sendTaskReminderEmail(input: TaskReminderEmailInput) {
  const baseUrl = process.env.NEXTAUTH_URL || "https://teriyakiturf.com";
  const dashboardUrl = `${baseUrl}/dashboard`;

  const productLine = input.quantity
    ? `${input.productName} (${input.quantity} for your lawn)`
    : input.productName;

  const resend = getResend();

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "hello@teriyakiturf.com",
    to: input.to,
    subject: `This week in ${input.userCity} — your lawn task is ready`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #2C3E50;">
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
          Hey ${input.firstName} —
        </p>
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
          Your Teriyaki Turf plan has a task ready this week:
        </p>

        <div style="background: #F6FBF7; border: 1px solid #D6E8DC; border-radius: 12px; padding: 20px 20px 22px;">
          <h2 style="font-size: 18px; color: #1B4332; margin: 0 0 8px;">
            ${input.taskName}
          </h2>
          <p style="font-size: 14px; color: #4B5A50; line-height: 1.6; margin: 0 0 16px;">
            ${input.taskPlainDescription}
          </p>
          <p style="font-size: 14px; color: #2C3E50; margin: 0 0 6px;">
            <strong>Best window:</strong> ${input.windowOpenDate} – ${input.windowCloseDate}
          </p>
          <p style="font-size: 14px; color: #2C3E50; margin: 0;">
            <strong>What you need:</strong> ${productLine}
          </p>
        </div>

        <div style="margin: 24px 0;">
          <a href="${dashboardUrl}" style="
            display: inline-block;
            background: #F4631E;
            color: white;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 700;
          ">
            See Full Task in App →
          </a>
        </div>

        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
          — Trever
        </p>
        ${
          input.soilTemp !== null
            ? `<p style="font-size: 13px; color: #6B7B70; margin: 0;">
                 P.S. Soil temp in ${input.userCity} right now: ${input.soilTemp}°F
               </p>`
            : ""
        }

        <hr style="border: none; border-top: 1px solid #D6E8DC; margin: 24px 0 12px;" />
        <p style="font-size: 11px; color: #9CA3AF; line-height: 1.5;">
          You're getting this because weekly task reminders are on for your
          Teriyaki Turf account. Turn them off anytime in
          <a href="${baseUrl}/settings" style="color: #6B7B70;">Settings</a>.
        </p>
      </div>
    `,
  });
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
