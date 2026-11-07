import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const isProd = process.env.NODE_ENV === 'production';
  const port = 3000;

  app.use(express.json());

  // Server-side Gemini API Proxy
  app.post('/api/gemini', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      }

      const { prompt, systemInstruction, history } = req.body;
      const ai = new GoogleGenAI({ apiKey });

      // We use ai.models.generateContent with 'gemini-2.5-flash'
      const options: any = {
        model: 'gemini-2.5-flash',
        contents: history ? history : prompt,
      };

      if (systemInstruction) {
        options.config = {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        };
      }

      const response = await ai.models.generateContent(options);
      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: error.message || 'Error interacting with Gemini AI' });
    }
  });

  // Bootcamp Registration Endpoint with Google Sheets / File Store
  app.post('/api/bootcamp/register', async (req, res) => {
    try {
      const {
        parentName,
        parentContact,
        parentEmail,
        studentName,
        studentContact,
        schoolName,
        standard,
        institute,
        source,
        registrationStatus,
        paymentStatus,
      } = req.body;

      if (!parentName || !parentContact || !studentName || !schoolName || !standard || !institute) {
        return res.status(400).json({ success: false, error: 'Missing required registration fields.' });
      }

      // Generate unique registration ID format: AIP-2026-XXXXXX
      const randomAlphaNum = Math.random().toString(36).substring(2, 8).toUpperCase();
      const registrationId = `AIP-2026-${randomAlphaNum}`;

      // Date and Time in IST
      const now = new Date();
      const istOptions: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
      const timeOptions: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      const registrationDate = new Intl.DateTimeFormat('en-IN', istOptions).format(now);
      const registrationTime = new Intl.DateTimeFormat('en-IN', timeOptions).format(now);

      const record = {
        registrationId,
        registrationDate,
        registrationTime,
        parentName,
        parentContact,
        parentEmail: parentEmail || 'Not Provided',
        studentName,
        studentContact: studentContact || 'Not Provided',
        schoolName,
        standard,
        institute,
        registrationStatus: registrationStatus || 'Registered',
        source: source || 'AI Fluence Website',
        paymentStatus: paymentStatus || 'Not Applicable',
        createdAt: new Date().toISOString(),
      };

      // Save to local persistence store (and log for Google Sheets integration)
      const fs = await import('fs');
      const dbPath = path.join(__dirname, 'bootcamp_registrations.json');
      let records: any[] = [];
      if (fs.existsSync(dbPath)) {
        try {
          const fileData = fs.readFileSync(dbPath, 'utf8');
          records = JSON.parse(fileData);
        } catch (e) {}
      }
      records.push(record);
      fs.writeFileSync(dbPath, JSON.stringify(records, null, 2));

      // Optional: Auto-forward to Google Sheets Webhook if configured
      const sheetsWebhook = req.body.sheetsWebhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
      if (sheetsWebhook) {
        fetch(sheetsWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
        }).catch((err) => console.warn('Google Sheets Webhook forward error:', err));
      }

      const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1ZzB6VkS6DbA9XNobgwcy7NGBhUcuSrWdQSdyqTUyQ3A';
      const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;

      console.log('--- BOOTCAMP REGISTRATION RECORDED ---');
      console.log('Target Sheet:', SPREADSHEET_URL);
      console.log(record);

      res.json({
        success: true,
        registrationId,
        registrationDate,
        registrationTime,
        status: record.registrationStatus,
        spreadsheetId: SPREADSHEET_ID,
        spreadsheetUrl: SPREADSHEET_URL,
        message: 'Registration successfully recorded!',
      });
    } catch (error: any) {
      console.error('Bootcamp Registration Error:', error);
      res.status(500).json({ success: false, error: error.message || 'Internal server error during registration.' });
    }
  });

  // Get all registrations endpoint for export / viewing
  app.get('/api/bootcamp/registrations', async (req, res) => {
    try {
      const fs = await import('fs');
      const dbPath = path.join(__dirname, 'bootcamp_registrations.json');
      let records: any[] = [];
      if (fs.existsSync(dbPath)) {
        try {
          const fileData = fs.readFileSync(dbPath, 'utf8');
          records = JSON.parse(fileData);
        } catch (e) {}
      }
      res.json({ success: true, count: records.length, records });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  if (!isProd) {
    // In development: use Vite in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Server is running in development mode with Vite middleware on port 3000');
  } else {
    // In production: serve built files from dist
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
    console.log('Server is running in production mode serving dist on port 3000');
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`LingoDuels Server listening at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
});
