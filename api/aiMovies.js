const fetch = require('node-fetch');
const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// Function to fetch movie recommendations
const recommendMoviesWithAI = async (movieInput) => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is missing. Please check your .env file.');
    }

    const maxRetries = 3;
    let retries = 0;
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    while (retries < maxRetries) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are an expert in the Marvel Cinematic Universe.' },
                        { role: 'user', content: `Suggest 5 MCU movies related to: ${movieInput}.` },
                    ],
                }),
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                console.error('OpenAI API Error Details:', errorDetails);
                if (response.status === 429) {
                    console.log('Rate limit exceeded, retrying...');
                    await delay(1000);
                    retries++;
                    continue;
                }
                throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content
                .split('\n')
                .map((movie) => movie.trim());
        } catch (error) {
            console.error('Error in recommendMoviesWithAI:', error.message);
            if (retries >= maxRetries) {
                throw new Error('AI recommendation failed after multiple retries');
            }
            retries++;
            await delay(1000); 
        }
    }
};

// POST route for recommending movies
router.post('/recommend-movies', async (req, res) => {
    const { movieInput } = req.body;

    if (!movieInput) {
        return res.status(400).json({ error: 'movieInput is required in the request body.' });
    }

    try {
        const recommendations = await recommendMoviesWithAI(movieInput);
        res.json({ recommendations });
    } catch (error) {
        console.error('Error in POST /recommend-movies:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;