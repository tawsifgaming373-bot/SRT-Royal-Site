async function sendEmail() {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) return { sent: false, reason: 'Email provider is not configured.' };
  throw new Error('Email transport is not implemented for the configured provider.');
}

module.exports = { sendEmail };
