const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 18012;

const cors = require("cors");
const XHubAI = require("xhub-ai");





// เส้นทางหลัก
app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳');
});





// 🔑 ตั้งค่า API Key
const xhub = new XHubAI("rsnlabs_24dc3118a90a736097e171a6e45e34");

app.use(cors());

// ✅ API รับข้อความจาก URL และสร้างข้อความ AI
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

// ✅ API รับข้อความจาก URL และสร้างภาพ AI
app.get("/image", async (req, res) => {
    const prompt = req.query.prompt;
    const model = req.query.model || "stable-diffusion";

    if (!prompt) return res.status(400).json({ error: "กรุณาใส่ prompt" });

    try {
        const response = await xhub.imageGeneration({ model, prompt });
        res.json({ image_url: response });
    } catch (error) {
        res.status(500).json({ error: "เกิดข้อผิดพลาด", details: error.message });
    }
});

// ✅ เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`🚀 API พร้อมใช้งานที่ http://localhost:${PORT}`);
});