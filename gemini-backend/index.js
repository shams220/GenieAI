const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration to allow requests only from the frontend running at localhost:5174
app.use(cors({
  origin: 'http://localhost:5174',  // Ensure your frontend's URL is allowed
  methods: ['GET', 'POST', 'OPTIONS'],  // Allow necessary HTTP methods
  allowedHeaders: ['Content-Type'],    // Allow content-type header for JSON
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Gemini backend is running.');
  });
  

app.post('/gemini', async (req, res) => {
  const userInput = req.body.prompt;

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{ parts: [{ text: userInput }] }],
      },
      {
        params: { key: process.env.GEMINI_API_KEY },  // Use API key from environment
      }
    );

    // Sending back the result from the Gemini API
    res.json({ result: response.data.candidates[0].content.parts[0].text });

  } catch (error) {
    // Catching any errors and sending a 500 status with an error message
    res.status(500).json({ error: 'Error calling Gemini API' });
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
