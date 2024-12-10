require('dotenv').config();

// Imports the Google Analytics Data API client library.
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const analyticsDataClient = new BetaAnalyticsDataClient();

// Runs a simple report.
async function runReport(startDate, endDate, period) {
  const startTime = Date.now();

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${process.env.PROPERTY_ID}`,
    dateRanges: [
      {
        startDate: startDate,
        endDate: endDate,
      },
    ],
    dimensions: [
      {
        name: 'city',
      },
    ],
    metrics: [
      {
        name: 'activeUsers',
      },
    ],
  });

  console.log(period, 'Report result:');
  response.rows.forEach(row => {
    console.log(row.dimensionValues[0], row.metricValues[0]);
  });

  const endTime = Date.now();

  console.log(`API request time: ${endTime - startTime} ms\n`);
}

module.exports = { runReport };