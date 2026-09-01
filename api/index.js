const createApp = require('../server/app');
const fs = require('fs');
const path = require('path');
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
};

let appPromise;
let appError = null;

module.exports = async function vercelHandler(req, res) {
  if (!req.url.startsWith('/api')) {
    const requestedPath = decodeURIComponent(req.url.split('?')[0]);
    const relativePath = requestedPath === '/' ? 'index.html' : requestedPath.replace(/^\/+/, '');
    const publicRoot = path.resolve(__dirname, '../public');
    const filePath = path.resolve(publicRoot, relativePath);
    if (filePath.startsWith(publicRoot) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.statusCode = 200;
      res.setHeader('Content-Type', mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream');
      return res.end(fs.readFileSync(filePath));
    }
    const indexPath = path.join(publicRoot, 'index.html');
    res.statusCode = 200;
    res.setHeader('Content-Type', mime['.html']);
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
