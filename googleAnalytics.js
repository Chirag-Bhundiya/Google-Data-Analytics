// Required to access environment variables
require('dotenv').config();

const express = require('express');

const app = express();

const port = 8000;

// Imports the Google Analytics Data API client library.
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const analyticsDataClient = new BetaAnalyticsDataClient();

// Function to fetch country details through Google Analytics API for given date range
const getCountryDataByDateRange = async (period, startDate, endDate) => {
    try {
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
             if (country !== '(not set)') {
                uniqueCountries.add(country);
             }
         });
 
         // The size of the Set gives us the number of unique countries
         const numberOfCountries = uniqueCountries.size;
         
         console.log(period, 'Analytics Data:');
         console.log('Total Country: ', uniqueCountries)
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

// Function to fetch country details through Google Analytics API
const getCountryData = async () => {
    try {
        const weeklyCountryData = await getCountryDataByDateRange('Weekly', '6daysAgo', 'today');
        const monthlyCountryData = await getCountryDataByDateRange('Monthly', '28daysAgo', 'today');
        const yearlyCountryData = await getCountryDataByDateRange('Yearly', '365daysAgo', 'today');

        const data = {
            ...weeklyCountryData,
            ...monthlyCountryData,
            ...yearlyCountryData,
        };

        return data;

    } catch (error) {
        console.error('Error fetching report:', error);
        throw error;
    }
}

// Function to fetch view count details through Google Analytics API for given date range
const getViewCountDataByDateRange = async (period, startDate, endDate) => {
    try {
        const startTime = Date.now();

        // Request data from Google Analytics API for page views (screenPageViews)
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
            ],
        });

        let viewCount = 0;

        // If data is available, retrieve the view count
        if (response.rows.length > 0) {
            viewCount = parseInt(response.rows[0].metricValues[0].value, 10);
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

// Function to fetch view count details through Google Analytics API
const getViewCountData = async () => {
    try {
        const weeklyViewCountData = await getViewCountDataByDateRange('Weekly', '6daysAgo', 'today');
        const monthlyViewCountData = await getViewCountDataByDateRange('Monthly', '28daysAgo', 'today');
        const yearlyViewCountData = await getViewCountDataByDateRange('Yearly', '365daysAgo', 'today');

        const data = {
            ...weeklyViewCountData,
            ...monthlyViewCountData,
            ...yearlyViewCountData,
        };

        return data;

    } catch (error) {
        console.error('Error fetching report:', error);
        throw error;
    }
}

// Function to fetch visitor count details through Google Analytics API for given date range
const getVisitorsCountDataByDateRange = async (period, startDate, endDate) => {
    try {
        const startTime = Date.now();

        // Request data from Google Analytics API for visitor count (users)
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
                { name: 'activeUsers' }, 
            ],
        });

        let visitorCount = 0;

        // If data is available, retrieve the user count
        if (response.rows.length > 0) {
            visitorCount = parseInt(response.rows[0].metricValues[0].value, 10);
        }

        console.log(period, 'Visitor Count:', visitorCount);

        // Calculate the total time taken for the API request
        const endTime = Date.now();
        console.log(`API request time: ${endTime - startTime} ms\n`);

        return visitorCount;

    } catch (error) {
        console.error('Error fetching report:', error);
        throw error;
    }
}

// Function to fetch visitor count details through Google Analytics API
const getVisitorsCountData = async () => {
    try {
        const weeklyVisitorsCountData = await getVisitorsCountDataByDateRange('Weekly', '6daysAgo', 'today');
        const monthlyVisitorsCountData = await getVisitorsCountDataByDateRange('Monthly', '28daysAgo', 'today');
        const yearlyVisitorsCountData = await getVisitorsCountDataByDateRange('Yearly', '365daysAgo', 'today');

        const data = {
            ...weeklyVisitorsCountData,
            ...monthlyVisitorsCountData,
            ...yearlyVisitorsCountData,
        };

        return data;

    } catch (error) {
        console.error('Error fetching report:', error);
        throw error;
    }
}

// Function to fetch visitors by country through Google Analytics API for given date range
const getVisitorsByCountryDataByDateRange = async (period, startDate, endDate) => {
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
        if(country !== '(not set)') {
            console.log(`${country}: ${activeUsers}`);
            result.push({ country, activeUsers });
        }
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

// Function to fetch visitors by country through Google Analytics API
const getVisitorsByCountryData = async () => {
    try {
        const weeklyVisitorsByCountryData = await getVisitorsByCountryDataByDateRange('Weekly', '6daysAgo', 'today');
        const monthlyVisitorsByCountryData = await getVisitorsByCountryDataByDateRange('Monthly', '28daysAgo', 'today');
        const yearlyVisitorsByCountryData = await getVisitorsByCountryDataByDateRange('Yearly', '365daysAgo', 'today');

        const data = {
            ...weeklyVisitorsByCountryData,
            ...monthlyVisitorsByCountryData,
            ...yearlyVisitorsByCountryData,
        };

        return data;

    } catch (error) {
        console.error('Error fetching report:', error);
        throw error;
    }
}

// Function to fetch average visit time details through Google Analytics API for given date range
const getAverageVisitTimeDataByDateRange = async (period, startDate, endDate) => {
    try {
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
                { name: 'userEngagementDuration' },
            ],
        });

        let engagementTime = 0, activeUsers = 0;
        response.rows.forEach((item) => {
            activeUsers += parseInt(item.metricValues[1].value, 10);
            engagementTime += parseInt(item.metricValues[2].value, 10);
        });

        let averageEngagementTimePerActiveUser = 0;
        averageEngagementTimePerActiveUser = Math.round(engagementTime / activeUsers);

        // Convert the average time from seconds to minutes and seconds
        const minutes = Math.floor(averageEngagementTimePerActiveUser / 60);
        const seconds = Math.round(averageEngagementTimePerActiveUser % 60);

        console.log(period, 'Average Session Duration:', minutes, 'minutes', seconds, 'seconds');

        // Calculate the total time taken for the API request
        const endTime = Date.now();
        console.log(`API request time: ${endTime - startTime} ms\n`);

        // Return the duration in minutes and seconds
        return { minutes, seconds };

    } catch (error) {
        console.error('Error fetching report:', error);
        throw error;
    }
}

// Function to fetch average visit time details through Google Analytics API
const getAverageVisitTimeData = async () => {
    try {
        const weeklyAverageVisitTimeData = await getAverageVisitTimeDataByDateRange('Weekly', '6daysAgo', 'today');
        const monthlyAverageVisitTimeData = await getAverageVisitTimeDataByDateRange('Monthly', '28daysAgo', 'today');
        const yearlyAverageVisitTimeData = await getAverageVisitTimeDataByDateRange('Yearly', '365daysAgo', 'today');

        const data = {
            ...weeklyAverageVisitTimeData,
            ...monthlyAverageVisitTimeData,
            ...yearlyAverageVisitTimeData,
        };

        return data;

    } catch (error) {
        console.error('Error fetching report:', error);
        throw error;
    }
}

// Function to fetch average visit time details through Google Analytics API for given date range
const getViewsPerActiveUserDataByDateRange = async (period, startDate, endDate) => {
    try {
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

// Function to fetch average visit time details through Google Analytics API
const getViewsPerActiveUserData = async () => {
    try {
        const weeklyViewsPerActiveUserData = await getViewsPerActiveUserDataByDateRange('Weekly', '6daysAgo', 'today');
        const monthlyViewsPerActiveUserData = await getViewsPerActiveUserDataByDateRange('Monthly', '28daysAgo', 'today');
        const yearlyViewsPerActiveUserData = await getViewsPerActiveUserDataByDateRange('Yearly', '365daysAgo', 'today');

        const data = {
            ...weeklyViewsPerActiveUserData,
            ...monthlyViewsPerActiveUserData,
            ...yearlyViewsPerActiveUserData,
        };

        return data;

    } catch (error) {
        console.error('Error fetching report:', error);
        throw error;
    }
}

const getAnalyticsData = async () => {
    try {
        const countryData = await getCountryData();
        const viewCountData = await getViewCountData();
        const visitorsCountData = await getVisitorsCountData();
        const visitorsByCountryData = await getVisitorsByCountryData();
        const averageVisitTimeData = await getAverageVisitTimeData();
        const viewsPerActiveUserData = await getViewsPerActiveUserData();

        const data = {
            ...countryData,
            ...viewCountData,
            ...visitorsCountData,
            ...visitorsByCountryData,
            ...averageVisitTimeData,
            ...viewsPerActiveUserData,
        }

        return data;

    } catch (error) {
        console.error('Error in fetching Google Analytics Data:', error);
        throw error;
    }
}

module.exports = { getAnalyticsData };