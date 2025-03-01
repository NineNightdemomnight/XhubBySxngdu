import express from "express";
import cors from "cors";
import { XHubAI } from "xhub-ai";

const app = express();
const PORT = 3000;

const xhub = XHubAI("rsnlabs_24dc3118a90a736097e171a6e45e34");

app.use(cors());

app.get("/generate", async (req, res) => {
    const prompt = req.query.prompt;
    const model = req.query.model || "gpt-4";

    if (!prompt) return res.status(400).json({ error: "กรุณาใส่ prompt" });

    try {
        const response = await xhub.textGeneration({ model, prompt });
        res.json({ result: response });
    } catch (error) {
        res.status(500).json({ error: "เกิดข้อผิดพลาด", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 API พร้อมใช้งานที่ http://localhost:${PORT}`);
});
