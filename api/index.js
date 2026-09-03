const createApp = require('../server/app');
const fs = require('fs');
const path = require('path');
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

// Helmet only wraps the Express app below, which on Vercel only ever sees
// /api/* requests — plain page/asset requests are served directly from this
// handler and never touch Express, so they need their own security headers.
function setStaticSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; object-src 'none'; " +
    "base-uri 'self'; frame-ancestors 'self'; upgrade-insecure-requests"
  );
}

let appPromise;
let appError = null;

module.exports = async function vercelHandler(req, res) {
  if (!req.url.startsWith('/api')) {
    const requestedPath = decodeURIComponent(req.url.split('?')[0]);
    const relativePath = requestedPath === '/' ? 'index.html' : requestedPath.replace(/^\/+/, '');
    const publicRoot = path.resolve(__dirname, '../public');
    const filePath = path.resolve(publicRoot, relativePath);
    setStaticSecurityHeaders(res);
    if (filePath.startsWith(publicRoot) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.statusCode = 200;
      res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
      // HTML is revalidated on every request so a new deploy shows up immediately;
      // everything else (fonts, images, css, js) is safe to cache for a week.
      res.setHeader('Cache-Control', ext === '.html' ? 'no-cache' : 'public, max-age=604800, immutable');
      return res.end(fs.readFileSync(filePath));
    }
    const indexPath = path.join(publicRoot, 'index.html');
    res.statusCode = 200;
    res.setHeader('Content-Type', mime['.html']);
    res.setHeader('Cache-Control', 'no-cache');
    return res.end(fs.readFileSync(indexPath));
  }

  if (appError) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ message: appError }));
  }

  if (!appPromise) {
    appPromise = createApp().catch((error) => {
      appError = error.message || 'Server initialization failed';
      throw error;
    });
  }

  try {
    const app = await appPromise;
    return app(req, res);
  } catch (error) {
    if (!res.headersSent) {
      res.statusCode = 503;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: appError || error.message || 'Server error' }));
    }
  }
};
