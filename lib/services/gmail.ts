import { google } from 'googleapis'

function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
  )
  client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN })
  return client
}

/** Build a base64url-encoded RFC 2822 email string */
function buildRawEmail({
  to,
  from,
  subject,
  htmlBody,
}: {
  to: string
  from: string
  subject: string
  htmlBody: string
}): string {
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    htmlBody,
  ].join('\r\n')

  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Send a single email via Gmail API.
 * Uses the OAuth2 refresh token stored in env — Google auto-refreshes the access token.
 */
export async function sendEmail({
  to,
  subject,
  htmlBody,
}: {
  to: string
  subject: string
  htmlBody: string
}): Promise<void> {
  const auth = getOAuth2Client()
  const gmail = google.gmail({ version: 'v1', auth })
  const from = process.env.GMAIL_SENDER_EMAIL!

  const raw = buildRawEmail({ to, from, subject, htmlBody })
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw },
  })
}

/**
 * Send a verification email with a link to confirm subscription.
 */
export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const verifyUrl = `${siteUrl}/api/newsletter/verify?token=${token}`

  await sendEmail({
    to,
    subject: 'Confirm your newsletter subscription',
    htmlBody: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; color: #e4e4e7; background: #09090b;">
        <h2 style="color: #FF8000; margin-bottom: 16px;">Confirm your subscription</h2>
        <p style="color: #a1a1aa; line-height: 1.6;">
          Click the button below to verify your email and start receiving your domain newsletters.
        </p>
        <a href="${verifyUrl}"
           style="display: inline-block; margin: 24px 0; padding: 12px 28px; background: #FF8000; color: #000;
                  font-weight: bold; text-decoration: none; border-radius: 8px;">
          Confirm Subscription
        </a>
        <p style="color: #52525b; font-size: 12px;">
          This link expires in 24 hours. If you didn't subscribe, ignore this email.
        </p>
        <p style="color: #52525b; font-size: 12px;">
          Or copy this URL: ${verifyUrl}
        </p>
      </div>
    `,
  })
}
