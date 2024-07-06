import cron from "node-cron";
import { User } from "../models/User";
import {
  fetchPortfolioValue,
  addPortfolioValue,
} from "../services/portfolioServices";

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
