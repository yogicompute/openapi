const express = require("express");
const dotenv = require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

async function generateContent(userInput) {
    try {
        const result = await model.generateContent(userInput);
        let responseText = result.response.text();
        return responseText.trim();
    } catch (error) {
        console.error("Error generating content:", error);
        throw error;
    }
}

app.get('/send', async (req, res) => {
    const userInput = `${req.query.input}`;


    if (!userInput) {
        return res.status(400).json({ error: "Missing input parameter" });
    }

    try {
        const responseFromApi = await generateContent(userInput);
        res.status(200).json({ result: responseFromApi });
    } catch (error) {
        res.status(500).json({ error: "Error generating content" });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
