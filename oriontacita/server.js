const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

const dataPathFolder = path.join(__dirname, 'data');
const dataFilePath = path.join(dataPathFolder, 'assessments.json');

function readData() {
    if (!fs.existsSync(dataPathFolder)) fs.mkdirSync(dataPathFolder, { recursive: true });
    if (!fs.existsSync(dataFilePath)) return [];
    return JSON.parse(fs.readFileSync(dataFilePath, 'utf8') || '[]');
}

function writeData(data) {
    if (!fs.existsSync(dataPathFolder)) fs.mkdirSync(dataPathFolder, { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/api/assessments', (req, res) => {
    const data = readData();
    res.json({
        success: true,
        data: data
    });
});

app.post('/api/assessments', (req, res) => {
    const formData = req.body;
    
    const data = readData();
    const newEntry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        ...formData 
    };

    data.push(newEntry);
    writeData(data);

    res.status(201).json({
        success: true,
        message: 'Data input berhasil disimpan',
        data: newEntry
    });
});

app.listen(PORT, () => {
    console.log(`Server pencatatan data berjalan di http://localhost:${PORT}`);
});