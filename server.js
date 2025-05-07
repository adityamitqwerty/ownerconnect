const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const app = express();
const port = process.env.PORT || 3000;

// Add this after initial setup
app.use(express.json()); // Add this line before routes

// Update login route
app.post('/login', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false });
    }
    
    // Store user in memory (for demo only)
    users[email] = { loggedIn: true };
    res.json({ success: true });
});

// Connect to Google Sheet
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

app.use(express.static('public'));
app.use(express.json());

// Login System (Simplified)
const users = {};
app.post('/login', (req, res) => {
  const { email } = req.body;
  users[email] = true;
  res.send({ success: true });
});

// Get Areas
app.get('/areas', async (req, res) => {
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  });
  
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  
  const areas = [...new Set(rows.map(row => row.Area))];
  res.json(areas);
});

// Payment Integration
app.post('/payment', (req, res) => {
  const paymentData = {
    key: process.env.PAYU_KEY,
    txnid: Date.now(),
    amount: '500.00',
    productinfo: 'Contact Access',
    firstname: 'Customer',
    email: req.body.email,
    surl: '/success',
    furl: '/failure',
    hash: 'TESTHASH' // Replace with actual hash in production
  };
  res.json(paymentData);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
