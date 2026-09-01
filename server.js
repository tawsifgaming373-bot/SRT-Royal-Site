require('dotenv').config();

const createApp = require('./server/app');

const PORT = process.env.PORT || 3000;

(async () => {
  const app = await createApp();
  const server = app.listen(PORT, () => {
    console.log(`✅ SRT Royal Server running at http://localhost:${PORT}`);
  });

  const shutdown = async () => {
    server.close(() => process.exit(0));
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
})();
