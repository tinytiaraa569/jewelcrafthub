const express = require("express");
const router = express.Router();
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
require("dotenv").config();

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    type: "service_account",
    project_id: process.env.GA_PROJECT_ID,
    private_key_id: process.env.GA_PRIVATE_KEY_ID,
    private_key: process.env.GA_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GA_CLIENT_EMAIL,
    client_id: process.env.GA_CLIENT_ID,
  },
});

// Route to fetch live active users in the last 30 minutes along with their country
router.get("/getall-live-users", async (req, res) => {
  try {
    const propertyId = process.env.GA_PROPERTY_ID;

    // Fetch live users (last 30 minutes) along with their country
    const [liveReport] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: "activeUsers" }],
      dimensions: [{ name: "country" }], // Add country as a dimension
    });

    // Extract live users count and countries
    const liveUsers = liveReport.rows?.[0]?.metricValues?.[0]?.value || '0';
    const liveUsersByCountry = liveReport.rows?.map(row => ({
      country: row.dimensionValues[0]?.value,
      activeUsers: row.metricValues[0]?.value,
    })) || [];

    res.json({
      success: true,
      data: {
        liveUsers: Number(liveUsers), // Convert to number for consistency
        liveUsersByCountry,
      },
    });
  } catch (error) {
    console.error("Google Analytics error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch analytics data",
    });
  }
});


// Helper function to calculate date ranges based on the given filter
const getDateRange = (filter) => {
  const today = new Date();
  let startDate;
  
  switch (filter) {
    case "1month":
      startDate = new Date(today.setMonth(today.getMonth() - 1));
      break;
    case "3months":
      startDate = new Date(today.setMonth(today.getMonth() - 3));
      break;
    case "6months":
      startDate = new Date(today.setMonth(today.getMonth() - 6));
      break;
    default:
      startDate = new Date(today.setMonth(today.getMonth() - 1)); // default to 1 month
      break;
  }
  
  const endDate = new Date(); // today
  return {
    startDate: startDate.toISOString().split('T')[0], // formatted as YYYY-MM-DD
    endDate: endDate.toISOString().split('T')[0],     // formatted as YYYY-MM-DD
  };
};

// Route to get daily visitors with a dynamic filter
router.get("/get-daily-visitors", async (req, res) => {
  const filter = req.query.filter || "1month"; // default to 1 month
  const { startDate, endDate } = getDateRange(filter);

  console.log("Date Range for Filter:", startDate, endDate); // Debugging the range

  try {
    const propertyId = process.env.GA_PROPERTY_ID;

    // Run the report for the given date range
    const [report] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }],
    });

    // Prepare the result array
    const dailyVisitors = [];
    const allDates = []; // To hold all dates between startDate and endDate

    // Generate all dates between startDate and endDate
    let currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
      allDates.push(currentDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
      currentDate.setDate(currentDate.getDate() + 1); // Increment day by day
    }

    // Map the API response to match the expected structure
    report.rows?.forEach(row => {
      const date = row.dimensionValues[0]?.value; // Extract the date
      const activeUsers = parseInt(row.metricValues[0]?.value, 10); // Parse the active users count
      dailyVisitors.push({
        date,
        activeUsers,
      });
    });

    // Add missing dates with 0 active users if they are not present in the API response
    allDates.forEach(date => {
      if (!dailyVisitors.some(item => item.date === date)) {
        dailyVisitors.push({ date, activeUsers: 0 });
      }
    });

    // Sort the results by date (ascending order)
    dailyVisitors.sort((a, b) => a.date.localeCompare(b.date));

    // Send the final response
    res.json({
      success: true,
      data: dailyVisitors,
      filter: filter, // return the applied filter
    });
  } catch (error) {
    console.error("Analytics Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch daily visitors data",
    });
  }
});


// Route to fetch page views for all pages within a specific time range
router.get("/get-all-page-views", async (req, res) => {
  const { filter = "1month" } = req.query;  // Filter (1month, 3months, 6months)
  
  const { startDate, endDate } = getDateRange(filter); // Helper function for date ranges
  
  try {
    const propertyId = process.env.GA_PROPERTY_ID;

    // Fetch the page view data for all pages within the given time range
    const [report] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [{ name: "pagePath" }],  // Track page views based on page URL
      metrics: [{ name: "screenPageViews" }], // Metric for page views
    });

    // Prepare the result
    const pageViewData = report.rows?.map(row => ({
      pageUrl: row.dimensionValues[0]?.value,
      pageViews: row.metricValues[0]?.value,
    })) || [];

    // Send the response with the page view data
    res.json({
      success: true,
      data: pageViewData,
      filter: filter,  // Return the applied filter (1month, 3months, etc.)
    });
  } catch (error) {
    console.error("Analytics Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch page view data",
    });
  }
});

//page views
module.exports = router;
