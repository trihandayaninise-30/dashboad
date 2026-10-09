// app.post('/api/assessments', async (req, res) => {
//     const userEmail = req.body.companyEmail;
    
//     // Menggunakan key kapital sesuai standar API AI Engineer
//     const payloadToAI = {
//         Email: userEmail,
//         Name: "Abdul" // Diisi default agar lolos validasi required
//     };

//     let aiResponseResult = "Menunggu respons AI...";
//     let responseStatus = 500;

//     try {
        
//         const apiResponse = await fetch('http://169.58.24.219:4024/send-result', {
//             method: 'POST',
//             headers: { 
//                 'Content-Type': 'application/json' 
//             },
//             body: JSON.stringify(payloadToAI)
//         });
        
//         responseStatus = apiResponse.status; // Ambil status code (misal 200, 400, dll)
//         aiResponseResult = await apiResponse.json();

//     } catch (error) {
//         console.error("Gagal terhubung ke AI:", error.message);
//         responseStatus = 500;
//         aiResponseResult = { error: "Gagal terhubung ke server AI" };
//     }

    
//     const formattedStatusAI = typeof aiResponseResult === 'object' ? JSON.stringify(aiResponseResult) : aiResponseResult;

//     const assessments = readData();
//     const newEntry = {
//         id: Date.now(),
//         date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
//         companyEmail: userEmail,
//         statusAI: formattedStatusAI
//     };

//     assessments.unshift(newEntry);
//     writeData(assessments);

//     res.status(responseStatus).json({
//         success: responseStatus >= 200 && responseStatus < 300,
//         status: responseStatus,
//         message: formattedStatusAI,
//         data: newEntry
//     });
// });


const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'assessments.json');

// --- MIDDLEWARE WAJIB AGAR REQ.BODY TIDAK KOSONG ---
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function readData() {
    if (!fs.existsSync(DATA_FILE)) return [];
    try {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
        return fileContent.trim() ? JSON.parse(fileContent) : [];
    } catch (err) {
        return [];
    }
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Route halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'demo.html'));
});

// API untuk mengambil data tabel log
app.get('/api/assessments', (req, res) => {
    res.json({ success: true, data: readData() });
});

// API POST untuk mengirim data ke AI Engineer
app.post('/api/assessments', async (req, res) => {
    const userEmail = req.body.companyEmail;
    
    // Menggunakan key kapital sesuai standar API AI Engineer
    const payloadToAI = {
        Email: userEmail,
        Name: "nameVal "
    };

    let aiResponseResult = "Menunggu respons AI...";
    let responseStatus = 500;

    try {
        const apiResponse = await fetch('http://169.58.24.219:4024/send-result', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(payloadToAI)
        });
        
        responseStatus = apiResponse.status; 
        aiResponseResult = await apiResponse.json();

    } catch (error) {
        console.error("Gagal terhubung ke AI:", error.message);
        responseStatus = 500;
        aiResponseResult = { error: "Gagal terhubung ke server AI" };
    }

    const formattedStatusAI = typeof aiResponseResult === 'object' ? JSON.stringify(aiResponseResult) : aiResponseResult;

    // Simpan ke file assessments.json
    const assessments = readData();
    const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        companyEmail: userEmail,
        statusAI: formattedStatusAI
    };

    assessments.unshift(newEntry);
    writeData(assessments);

    res.status(responseStatus).json({
        success: responseStatus >= 200 && responseStatus < 300,
        status: responseStatus,
        message: formattedStatusAI,
        data: newEntry
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});