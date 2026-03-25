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
}));
app.use(express.json({ limit: '10mb' }));

// Ensure output directory exists
const outputDir = join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

app.use('/api/pdf', pdfRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
