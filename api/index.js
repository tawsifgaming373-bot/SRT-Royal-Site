const createApp = require('../server/app');

let appPromise;

module.exports = async function vercelHandler(req, res) {
  if (!appPromise) appPromise = createApp();
  const app = await appPromise;
  return app(req, res);
};
