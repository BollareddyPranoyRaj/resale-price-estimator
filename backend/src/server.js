const express = require('express');
const cors = require('cors');

const phonesRouter = require('./routes/phones');
const { UpstreamApiError } = require('./lib/upstreamApi');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'resale-app-api',
    message: 'API is running. Use /api/health for the health check endpoint.',
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'resale-app-api',
    date: new Date().toISOString(),
  });
});

app.use('/api/phones', phonesRouter);

app.use((err, _req, res, _next) => {
  console.error(err);

  if (err instanceof UpstreamApiError) {
    return res.status(err.status).json({
      error: err.message,
    });
  }

  res.status(500).json({
    error: 'Internal server error',
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Resale API listening on port ${PORT}`);
  });
}

module.exports = {
  app,
};
