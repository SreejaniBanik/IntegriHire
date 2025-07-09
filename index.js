require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/analyze', async (req, res) => {
  const { text } = req.body;
  console.log("📩 Received text:", text);

  try {
    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',  // ✅ FIXED MODEL NAME
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI that detects fake job and internship offers. Classify the job post as "Real", "Scam", or "Suspicious" with explanation.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,

          'Content-Type': 'application/json'
        }
      }
    );

    const reply = groqResponse.data.choices[0].message.content;
    console.log("✅ Groq reply:", reply);
    res.json({ result: reply });

  } catch (error) {
    const errData = error.response?.data || error.message;
    console.error("❌ FULL ERROR:", errData);
    res.status(500).json({ error: 'Failed to analyze the job post', details: errData });
  }
});

app.listen(5000, () => {
  console.log('✅ Backend is running at http://localhost:5000');
});
