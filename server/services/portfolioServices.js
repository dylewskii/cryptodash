const User = require("../models/User");
require("dotenv").config();

/** -----------------------------------------------------------------------------------------------
 * Fetches the current dollar (USD) price of a crypto coin from the CoinGecko API.
 *
 * @param {string} coinId string coin id of which to fetch the price for.
 * @returns {Promise<number|null>} coin's dollar (USD) value or null if an error occurs
 */
const fetchCoinPrice = async (coinId) => {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    return data.market_data.current_price.usd;
  } catch (error) {
    console.error(
      `Failed to fetch coin price (for ${coinId}) from CoinGecko:`,
      error
    );
    return null;
  }
};

/** -----------------------------------------------------------------------------------------------
 * Finds the price of each coin held inside a user's portfolio and calculates the total value
 * of all holdings.
 *
 * @param userId string user id of which user to fetch details for.
 * @returns {Promise<number>} the total value of the user's portfolio at that current time.
 */
const fetchPortfolioValue = async (userId) => {
  // check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const portfolio = user.portfolio;
  if (!portfolio) {
    return 0;
  }

  let totalValue = 0;
  for (const coin of portfolio) {
    const price = await fetchCoinPrice(coin.id);
    if (!price) {
      totalValue += 0;
    }
    totalValue += coin.amount * price;
  }

  return totalValue;
};

/** -----------------------------------------------------------------------------------------------
 * Adds an object to the portfolioValues array within the user's database, containing the
 * portfolio value and timestamp.
 *
 * @param userId string ID of the user whose portfolio value is to be added.
 * @param totalValue the total value of the user's portfolio.
 * @returns {Promise<void>} A promise that resolves when the value is added.
 */
const addPortfolioValue = async (userId, totalValue) => {
  // check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  try {
    // save portfolio value to mongodb
    user.portfolioValues.push({ value: totalValue, timestamp: Date.now() });
    await user.save();
  } catch (err) {
    console.error("Failed to save portfolio value to db", err);
  }
};

module.exports = { fetchCoinPrice, fetchPortfolioValue, addPortfolioValue };
