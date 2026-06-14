/**
 * Email transport via Amazon SES SMTP (Nodemailer).
 *
 * SES SMTP credentials are created in the SES console under
 * "SMTP settings → Create SMTP credentials". They are different from
 * your IAM access keys — use the SMTP_USER / SMTP_PASS values here.
 *
 * Port 587 = STARTTLS (recommended)
 * Port 465 = implicit TLS
 */
import nodemailer from "nodemailer";

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

// Transporter is created lazily on first use so missing env vars produce a
// clear error at send-time rather than at module load time.
let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (_transporter) return _transporter;

  const port = Number(process.env.SMTP_PORT ?? "587");
  const secure = port === 465; // 465 = implicit TLS, 587 = STARTTLS

  _transporter = nodemailer.createTransport({
    host: requireEnv("SMTP_HOST"),
    port,
    secure,
    auth: {
      user: requireEnv("SMTP_USER"),
      pass: requireEnv("SMTP_PASS"),
    },
    // Keep the connection alive between sends
    pool: true,
    maxConnections: 5,
  });

  return _transporter;
}

/**
 * Sends an HTML email via Amazon SES SMTP.
 *
 * @param to      Recipient email address
 * @param subject Email subject line
 * @param html    HTML body content
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const from = `${process.env.EMAIL_FROM_NAME ?? "Yatrasetu"} <${requireEnv("EMAIL_FROM")}>`;

  await getTransporter().sendMail({ from, to, subject, html });
}
