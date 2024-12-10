// Required to access environment variables
require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();

const port = 8000;

// const { runReport } = require('./services/test-report.js');
// runReport('2024-11-01', '2024-11-07', 'Weekly');
// runReport('2024-11-01', '2024-11-30', 'Monthly');
// runReport('2023-11-01', '2024-11-01', 'Yearly');

// const { fetchVisitorsByCountry } = require('./services/fetch-visitors-by-country.js');
// fetchVisitorsByCountry('', '2024-12-03', '2024-12-09');
// fetchVisitorsByCountry('Last 7 days');

// const { fetchCountryData } = require('./services/fetch-country-data.js');
// fetchCountryData('', '2024-12-03', '2024-12-09');
// fetchCountryData('Last 7 days');

// const { fetchViewsPerActiveUser } = require('./services/fetch-views-per-active-user.js');
// fetchViewsPerActiveUser('', '2024-11-01', '2024-11-30');
// fetchViewsPerActiveUser('Last 7 days');

const { fetchAverageVisitTimeData } = require('./services/fetch-average-visit-time.js');
// fetchAverageVisitTimeData('', '2024-11-01', '2024-11-30');
fetchAverageVisitTimeData('Yesterday');

// const { fetchVisitorCountData } = require('./services/fetch-visitors-count.js');
// fetchVisitorCountData('', '2024-12-03', '2024-12-09');
// fetchVisitorCountData('Last 7 days');

// const { fetchViewCountData } = require('./services/fetch-view-count.js');
// fetchViewCountData('', '2024-12-03', '2024-12-09');
// fetchViewCountData('Last 7 days');

// const { testViewCountData } = require('./services/test.js');
// testViewCountData('2024-11-01', '2024-11-07', 'Weekly');
// testViewCountData('2024-11-01', '2024-11-30', 'Monthly');
// testViewCountData('2023-11-01', '2024-11-01', 'Yearly');

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

