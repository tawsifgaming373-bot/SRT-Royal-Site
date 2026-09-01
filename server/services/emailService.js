// Sends transactional email through the Resend HTTPS API using the global
// fetch API, so no SMTP/npm dependency is required (works on Vercel as-is).
async function sendEmail({ to, subject, text, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    return { sent: false, reason: 'Email provider is not configured.' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text: text || '',
      html: html || text || '',
    }),
  });

  if (!res.ok) {
    const detail = (await res.text().catch(() => '')).slice(0, 200);
    const error = new Error(`Email provider rejected the request (${res.status}). ${detail}`);
    error.statusCode = 502;
    throw error;
  }

  return { sent: true };
}

module.exports = { sendEmail };
