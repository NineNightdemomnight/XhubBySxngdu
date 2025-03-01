const { google } = require('googleapis');
const { OAuth2 } = require('google-auth-library');
const fs = require('fs');

// ฟังก์ชันเพื่อรับการยืนยันตัวตน (OAuth2) จาก Google
async function authenticateGoogleAPI() {
    const credentials = JSON.parse(fs.readFileSync('credentials.json'));
    const { client_id, client_secret, redirect_uris } = credentials.installed;
    const oauth2Client = new OAuth2(client_id, client_secret, redirect_uris[0]);

    // สร้าง URL สำหรับการยืนยันตัวตน
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/spreadsheets',
    });

    console.log('Authorize this app by visiting this url:', authUrl);
    // เมื่อผู้ใช้ยืนยันตัวตนแล้ว ให้นำรหัสที่ได้จาก URL มาใส่
    const code = 'AUTHORIZATION_CODE'; // ใส่รหัสที่ได้รับจาก URL ที่ผู้ใช้ยืนยัน

    // ใช้รหัสเพื่อรับ token
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    return oauth2Client;
}

// ฟังก์ชันเพื่ออัปโหลดข้อมูลลงใน Google Sheets
async function uploadDataToSheet(auth) {
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // เปลี่ยนเป็น ID ของ Google Sheet ที่คุณต้องการ
    const range = 'Sheet1!A1'; // เปลี่ยนเป็นช่วงเซลล์ที่คุณต้องการอัปโหลดข้อมูล

    const values = [
        ['ข้อมูลที่ 1', 'ข้อมูลที่ 2', 'ข้อมูลที่ 3'], // ตัวอย่างข้อมูลที่ต้องการอัปโหลด
    ];

    const resource = {
        values,
    };

    try {
        const response = await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            resource,
        });
        console.log('Data uploaded to Google Sheets successfully', response.data);
    } catch (error) {
        console.error('Error uploading data to Google Sheets', error);
    }
}

// เส้นทางใหม่สำหรับการอัปโหลดข้อมูล
app.get('/api/upload-to-sheet', async (req, res) => {
    try {
        const auth = await authenticateGoogleAPI();
        await uploadDataToSheet(auth);
        res.send('Data uploaded to Google Sheets successfully');
    } catch (error) {
        res.status(500).send('Failed to upload data to Google Sheets');
    }
});
