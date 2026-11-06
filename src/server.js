const app = require('./app');
const pool = require('./db');

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});

const shutdown = () => {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
