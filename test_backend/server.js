require('dotenv').config();
const express = require('express');
const omnishieldPlugin = require('./omnishield-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Apply the OmniShield Plugin globally to monitor all incoming traffic
app.use(omnishieldPlugin);

// --- Standard Mock Endpoints ---

// 1. Normal Traffic Endpoint
app.get('/api/products', (req, res) => {
    res.json({ message: "List of products", count: 10 });
});

// 2. Normal Traffic Endpoint (Checkout)
app.post('/api/checkout', (req, res) => {
    res.status(200).json({ status: "Success", transactionId: 998877 });
});

// 3. Sensitive Endpoint (Simulating Data Exfiltration)
// Returns a massive dummy payload
app.get('/api/admin/db-export', (req, res) => {
    // Generate a massive string to simulate a 60MB payload
    const massiveData = Buffer.alloc(60 * 1024 * 1024, 'a').toString();
    res.send(massiveData);
});

// 4. Restricted Endpoint (Simulating Insider Threat / Unauthorized Action)
app.delete('/api/users/:id', (req, res) => {
    res.status(200).json({ status: "Deleted", userId: req.params.id });
});


app.listen(PORT, () => {
    console.log(`Test Express Server running on http://localhost:${PORT}`);
    console.log('OmniShield Telemetry Plugin is active.');
});
