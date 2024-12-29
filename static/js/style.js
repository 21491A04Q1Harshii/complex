const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pay_later_service'
});

// Merchant Onboarding
app.post('/addMerchant', (req, res) => {
    const { app, txn_rate } = req.body;
    const sql = 'INSERT INTO merchants (app, txn_rate) VALUES (?, ?)';
    db.query(sql, [app, txn_rate], (err, result) => {
        if (err) throw err;
        res.send('Merchant added successfully!');
    });
});

// Fetch Reports
app.get('/reports', (req, res) => {
    const sql = `
        SELECT app, SUM(fees) AS total_fees
        FROM payments
        GROUP BY app;
    `;
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});