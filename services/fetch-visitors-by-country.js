require('dotenv').config();

// Imports the Google Analytics Data API client library.
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const analyticsDataClient = new BetaAnalyticsDataClient();

const { getDateRange } = require('./get-start-end-date.js');

// Function to fetch visitors by country and return data
async function fetchVisitorsByCountry(period, startDate = null, endDate = null) {
    try {
        // If startDate and endDate are not provided, calculate them based on the period
        if (!startDate || !endDate) {
            ({ startDate, endDate } = getDateRange(period));
            console.log(`Fetching data for the period: ${period} (Start: ${startDate}, End: ${endDate})`);
        } else {
            console.log(`Fetching data for the provided date range (Start: ${startDate}, End: ${endDate})`);
        }

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
                    name: 'country',
                },
            ],
            metrics: [
                {
                    name: 'activeUsers', 
                },
            ],
      });
  
      // Log the report result to the console
      console.log(period, 'Visitors by Country:');
      const result = [];
      response.rows.forEach(row => {
        const country = row.dimensionValues[0].value;
        const activeUsers = row.metricValues[0].value;
        console.log(`${country}: ${activeUsers}`);
        result.push({ country, activeUsers });
      });
  
      const endTime = Date.now();
      console.log(`API request time: ${endTime - startTime} \n`);

      // Return the result for the API endpoint
      return result;
  
    } catch (error) {
        console.error('Error fetching report:', error);
        throw error;
    }
}

module.exports = { fetchVisitorsByCountry };