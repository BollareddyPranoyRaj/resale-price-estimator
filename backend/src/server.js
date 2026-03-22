const express = require('express');
const cors = require('cors');

const phonesRouter = require('./routes/phones');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
  res.status(500).json({
    error: 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Resale API listening on port ${PORT}`);
});
