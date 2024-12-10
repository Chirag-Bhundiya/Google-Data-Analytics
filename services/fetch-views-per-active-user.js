require('dotenv').config();

// Imports the Google Analytics Data API client library.
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const analyticsDataClient = new BetaAnalyticsDataClient();

const { getDateRange } = require('./get-start-end-date.js');

// Function to fetch average visit time details through Google Analytics API
async function fetchViewsPerActiveUser(period, startDate = null, endDate = null) {
    try {
        // If startDate and endDate are not provided, calculate them based on the period
        if (!startDate || !endDate) {
            ({ startDate, endDate } = getDateRange(period));
            console.log(`Fetching data for the period: ${period} (Start: ${startDate}, End: ${endDate})`);
        } else {
            console.log(`Fetching data for the provided date range (Start: ${startDate}, End: ${endDate})`);
        }
        
        const startTime = Date.now();

        // Request data from Google Analytics API
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${process.env.PROPERTY_ID}`,
            dateRanges: [
                {
                    startDate: startDate, 
                    endDate: endDate,       
                },
            ],
            dimensions: [],
            metrics: [
                { name: 'screenPageViews' },
                { name: 'activeUsers' },
            ],
        });

        let viewsPerActiveUser = 0;

        // If data is available, calculate views per active user
        if (response.rows.length > 0) {
            const totalViews = parseInt(response.rows[0].metricValues[0].value, 10);
            const activeUsers = parseInt(response.rows[0].metricValues[1].value, 10);

            // Calculate views per active user
            if (activeUsers > 0) {
                viewsPerActiveUser = totalViews / activeUsers;
            }
        }

        console.log(period, 'Views per Active User:', viewsPerActiveUser);

        // Calculate the total time taken for the API request
        const endTime = Date.now();
        console.log(`API request time: ${endTime - startTime} ms\n`);

        return viewsPerActiveUser;

    } catch (error) {
        console.error('Error fetching report:', error);
        throw error;
    }
}

module.exports = { fetchViewsPerActiveUser };