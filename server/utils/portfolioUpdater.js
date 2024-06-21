const cron = require("node-cron");
const User = require("../models/User");
const {
  fetchPortfolioValue,
  addPortfolioValue,
} = require("../services/portfolioServices");

cron.schedule("0 * * * *", async () => {
  try {
    const users = await User.find();
    for (const user of users) {
      const userPortfolioValue = await fetchPortfolioValue(user._id);
      await addPortfolioValue(user._id, userPortfolioValue);
    }
  } catch (err) {
    console.error("Error in portfolio value save cron job:", err);
  }
});
