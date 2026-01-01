
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Sécurité
app.use(helmet());
app.use(cors());
app.use(express.json());

// In-memory Auth Storage (Simple MVP)
const authorizedUsers = new Map();

// Rate Limiting : 5 requêtes par minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 5,
  message: { success: false, error: "Trop de requêtes. Veuillez patienter une minute." }
});

// Middleware d'Auth
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: "Non autorisé" });
  
  if (authorizedUsers.has(token)) {
    next();
  } else {
    res.status(403).json({ success: false, error: "Session invalide" });
  }
};

// --- ROUTES ---

// Login simple par email
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: "Email invalide" });
  }
  
  const token = btoa(`${email}-${Date.now()}`);
  authorizedUsers.set(token, { email, createdAt: new Date() });
  
  res.json({ success: true, token });
});

// Proxy de génération avec Retry Logic
app.post('/api/generate', authenticateToken, limiter, async (req, res) => {
  const { prompt, config, type } = req.body;
  
  if (!prompt) return res.status(400).json({ success: false, error: "Prompt manquant" });

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const callWithRetry = async (attempts = 2) => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: config
      });
      return response;
    } catch (err) {
      if (attempts > 0 && (err.message.includes('timeout') || err.message.includes('503'))) {
        console.log(`Retry attempt... ${attempts} remaining`);
        return callWithRetry(attempts - 1);
      }
      throw err;
    }
  };

  try {
    const result = await callWithRetry();
    res.json({ success: true, data: result.text });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error:`, error.message);
    res.status(500).json({ 
      success: false, 
      error: "Erreur lors de la génération. Veuillez réessayer." 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
