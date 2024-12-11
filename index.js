// Required to access environment variables
require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();

const port = 8000;

const { getAnalyticsData } = require('./googleAnalytics.js');
getAnalyticsData();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '', 'index.html'));
});

app.get('/api/fetch-visitors-by-country', async (req, res) => {
    const { startDate, endDate, period } = req.query;

    if (!startDate || !endDate || !period) {
        return res.status(400).json({ error: 'startDate, endDate, and period are required' });
    }

    try {
        const data = await fetchVisitorsByCountry(startDate, endDate, period);
        res.json(data); 
    } catch(error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/api/fetch-view-count', async (req, res) => {
    const { startDate, endDate, period } = req.query;

    if (!startDate || !endDate || !period) {
        return res.status(400).json({ error: 'startDate, endDate, and period are required' });
    }

    try {
        const data = await fetchViewCountData(startDate, endDate, period);
        res.json(data); 
    } catch(error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Listening server on port no. 8000
app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});

