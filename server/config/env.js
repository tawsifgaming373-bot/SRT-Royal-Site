function validateEnvironment() {
  if (process.env.NODE_ENV === 'production') {
    const required = ['MONGODB_URI', 'JWT_SECRET'];
    const missing = required.filter((name) => !process.env[name] || process.env[name].includes('replace_with'));
    if (missing.length) throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
    if (process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 characters in production.');
  }
}

module.exports = { validateEnvironment };
