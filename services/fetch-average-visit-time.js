require('dotenv').config();

// Imports the Google Analytics Data API client library.
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const analyticsDataClient = new BetaAnalyticsDataClient();

const { getDateRange } = require('./get-start-end-date.js');

// Function to fetch average visit time details through Google Analytics API
async function fetchAverageVisitTimeData(period, startDate = null, endDate = null) {
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
                // { name: 'averageSessionDuration' },
                { name: 'screenPageViews' },
                { name: 'activeUsers' },
                { name: 'userEngagementDuration' },
            ],
        });

        let engagementTime = 0, activeUsers = 0;
        response.rows.forEach((item) => {
            activeUsers += parseInt(item.metricValues[1].value, 10);
            engagementTime += parseInt(item.metricValues[2].value, 10);
        });

        let avgAngementTimePerActiveUser = 0;
        avgAngementTimePerActiveUser = Math.round(engagementTime / activeUsers);

        // let averageSessionDuration = 0;

        // // If data is available, retrieve the average session duration
        // if (response.rows.length > 0) {
        //     averageSessionDuration = parseFloat(response.rows[0].metricValues[0].value);
        // }

        console.log(period, 'Average Session Duration:', Math.floor(avgAngementTimePerActiveUser / 60), 'minutes', avgAngementTimePerActiveUser % 60, 'seconds');

        // Calculate the total time taken for the API request
        const endTime = Date.now();
        console.log(`API request time: ${endTime - startTime} ms\n`);

        // return averageSessionDuration;
        return avgAngementTimePerActiveUser;

    } catch (error) {
        console.error('Error fetching report:', error);
        throw error;
    }
}

module.exports = { fetchAverageVisitTimeData };