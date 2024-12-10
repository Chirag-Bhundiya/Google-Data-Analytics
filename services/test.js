require('dotenv').config();

// Imports the Google Analytics Data API client library.
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const analyticsDataClient = new BetaAnalyticsDataClient();

// Function to fetch view count details through Google Analytics API
async function testViewCountData(startDate, endDate, period) {
    try {
        const startTime = Date.now();

        const [response] = await analyticsDataClient.runReport({
            property: `properties/${process.env.PROPERTY_ID}`,
            dateRanges: [
                {
                    startDate: startDate,
                    endDate: endDate,
                },
            ],
            dimensions: [{ name: "pagePath" }],
            metrics: [{ name: "screenPageViews" }],
        });
        
        var viewCount = 0;

        for(const row of response.rows) {
            viewCount += parseInt(row.metricValues[0].value, 10);
        }

        console.log(period, 'View Count:', viewCount);

        // Calculate the total time taken for the API request
        const endTime = Date.now();
        console.log(`API request time: ${endTime - startTime} ms\n`);

        return viewCount;
    } catch (error) {
        console.error('Error fetching report:', error);
        throw error;
    }
}

module.exports = { testViewCountData };