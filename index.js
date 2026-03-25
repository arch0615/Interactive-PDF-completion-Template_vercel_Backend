import express from 'express';
import cors from 'cors';
import { pdfRouter } from './routes/pdf.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',')
  : ['http://localhost:5174'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// Explicitly handle preflight requests
app.options('*', cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '10mb' }));

// Ensure output directory exists (use /tmp on Vercel as filesystem is read-only)
const outputDir = process.env.VERCEL ? '/tmp/output' : join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

app.use('/api/pdf', pdfRouter);

// For local development
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// For Vercel serverless
export default app;
