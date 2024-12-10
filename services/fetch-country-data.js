require('dotenv').config();

// Imports the Google Analytics Data API client library.
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const analyticsDataClient = new BetaAnalyticsDataClient();

const { getDateRange } = require('./get-start-end-date.js');

// Function to fetch country details through Google Analytics API
async function fetchCountryData(period, startDate = null, endDate = null) {
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
            dimensions: [
                { name: 'country' },
            ],
            metrics: [
                { name: 'sessions' },
            ],
        });

         // Set to store unique country names
         const uniqueCountries = new Set();

         // Loop through the rows and add each country to the set
         response.rows.forEach(row => {
             const country = row.dimensionValues[0].value;
             uniqueCountries.add(country);
         });
 
         // The size of the Set gives us the number of unique countries
         const numberOfCountries = uniqueCountries.size;
 
         console.log(period, 'Total Country: ', uniqueCountries)
         console.log('Number of unique countries:', numberOfCountries);

        // Calculate the total time taken for the API request
        const endTime = Date.now();
        console.log(`API request time: ${endTime - startTime} ms\n`);

        return uniqueCountries;

    } catch (error) {
        console.error('Error fetching report:', error);
        throw error;
    }
}

module.exports = { fetchCountryData };