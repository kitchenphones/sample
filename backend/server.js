// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const xlsx = require('xlsx');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Replace with your MongoDB connection string
mongoose.connect('your-mongodb-connection-string', { useNewUrlParser: true, useUnifiedTopology: true });

const phoneSchema = new mongoose.Schema({
    phoneNumber: String
});

const Phone = mongoose.model('Phone', phoneSchema);

app.post('/submit', async (req, res) => {
    const { phoneNumber } = req.body;
    const phone = new Phone({ phoneNumber });
    await phone.save();
    res.send('Phone number saved');
});

app.get('/export', async (req, res) => {
    const phones = await Phone.find({});
    const data = phones.map(phone => [phone.phoneNumber]);
    const ws = xlsx.utils.aoa_to_sheet([['Phone Numbers'], ...data]);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    const filename = 'phoneNumbers.xlsx';
    xlsx.writeFile(wb, filename);
    res.download(filename);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
