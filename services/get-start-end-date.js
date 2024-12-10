// Helper function to calculate date ranges
function getDateRange(period) {
    const endDate = new Date(); // Current date
    let startDate;

    // Utility function to get the previous Sunday
    function getPreviousSunday(date) {
        const previousSunday = new Date(date);
        previousSunday.setDate(date.getDate() - date.getDay()); // Set to the previous Sunday (Sunday = 0)
        return previousSunday;
    }

    switch (period) {
        case 'Today':
            startDate = new Date(endDate);
            startDate.setDate(endDate.getDate()); // Today
            break;
        case 'Yesterday':
            startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - 1); // Yesterday means 1 day ago
            break;
        case 'This week':
            startDate = getPreviousSunday(endDate); // Get the previous Sunday
            break;
        case 'Last week':
            const lastSunday = getPreviousSunday(endDate); // Get the previous Sunday (start of last week)
            lastSunday.setDate(lastSunday.getDate() - 7); 
            startDate = new Date(lastSunday); // Set start date to the previous Sunday
            endDate.setDate(lastSunday.getDate() + 6); // Set end date to the previous Saturday (6 days after Sunday)
            break;
        case 'Last 7 days':
            startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - 7); // 7 days ago
            break;
        case 'Last 28 days':
            startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - 28); // 28 days ago
            break;
        case 'Last 30 days':
            startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - 30); // 30 days ago
            break;
        case 'Last 90 days':
            startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - 90); // 90 days ago
            break;
        case 'Last 12 months':
            startDate = new Date(endDate);
            startDate.setFullYear(endDate.getFullYear() - 1); // 12 months ago
            break;
        case 'Last calendar year':
            startDate = new Date(endDate);
            startDate.setFullYear(endDate.getFullYear() - 1); // Previous year
            startDate.setMonth(0); // January
            startDate.setDate(1); // First day of the year
            endDate.setFullYear(endDate.getFullYear() - 1); // December of the previous year
            endDate.setMonth(11); // December
            endDate.setDate(31); // Last day of December
            break;
        case 'This year':
            startDate = new Date(endDate);
            startDate.setMonth(0); // January
            startDate.setDate(1); // First day of the year
            endDate.setMonth(endDate.getMonth()); // Current month
            endDate.setDate(endDate.getDate()); // Current date
            break;
        default:
            throw new Error('Invalid period');
    }

    // Format dates as YYYY-MM-DD for Google Analytics API
    const startDateFormatted = startDate.toISOString().split('T')[0];
    const endDateFormatted = endDate.toISOString().split('T')[0];

    return { startDate: startDateFormatted, endDate: endDateFormatted };
}

module.exports = { getDateRange };