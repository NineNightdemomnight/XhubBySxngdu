const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// ใช้ express สำหรับการรับข้อมูล POST
app.use(express.json());  // ใช้เพื่อรับข้อมูล JSON
app.use(express.urlencoded({ extended: true }));  // ใช้เพื่อรับข้อมูล form-data

// ตั้งค่าการเชื่อมต่อกับ Google Sheets API
const auth = new google.auth.GoogleAuth({
  keyFile: 'path/to/your/service-account-file.json',  // ใส่ path ของไฟล์ JSON ของ Service Account
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// ID ของ Google Sheets
const spreadsheetId = 'your-google-sheet-id';  // ใส่ ID ของ Google Sheets

// เส้นทางเพื่อรับข้อมูลและส่งไปยัง Google Sheets
app.post('/send-to-sheet', async (req, res) => {
  try {
    const { message } = req.body;

    // ข้อมูลที่ต้องการจะส่งไปยัง Google Sheets
    const values = [
      [new Date().toISOString(), message]  // ใส่วันที่และข้อความที่รับมาจาก HTTP request
    ];

    const resource = {
      values,
    };

    // ใช้ API เพิ่มข้อมูลลงใน Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:B',  // ช่วงที่ต้องการแทรกข้อมูล (A และ B ในแถวแรก)
      valueInputOption: 'RAW',
      resource,
    });

    res.status(200).send('ข้อมูลถูกส่งไปยัง Google Sheets แล้ว');
  } catch (error) {
    console.error('Error sending data to Google Sheets:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการส่งข้อมูล');
  }
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
