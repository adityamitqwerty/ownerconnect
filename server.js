const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const app = express();
app.use(express.static('public'));
app.use(express.json());

const doc = new GoogleSpreadsheet('YOUR_GOOGLE_SHEET_ID');

// Login System
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const sheet = doc.sheetsById[0]; // Users sheet
  await sheet.loadCells();
  
  for(let i=1; i<100; i++) {
    if(sheet.getCell(i,0).value === email && 
       sheet.getCell(i,1).value === password) {
      return res.send({ success: true });
    }
  }
  res.send({ success: false });
});

// Get Properties Data
app.get('/properties', async (req, res) => {
  const sheet = doc.sheetsById[1]; // Properties sheet
  const rows = await sheet.getRows();
  res.json(rows.map(row => ({
    area: row.Area,
    society: row.Society,
    flat: row.FlatNo,
    available: row.Available
  })));
});

// Start Server
app.listen(3000, () => console.log('Server running'));
