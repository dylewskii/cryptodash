/**
 * Validates if a coin exists within the CoinGecko API - returns true or false
 * @param {string} coinName string name of coin to validate
 * @returns {Promise<boolean>} a promise that resolves to true if coin exists or false otherwise
 */
const validateCoinName = async (coinName) => {
  const url = "https://api.coingecko.com/api/v3/coins/list";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
    },
  };

  try {
    const response = await fetch(url, options);
    const validCoins = await response.json();

    return validCoins.some(
      (coin) => coin.name.toLowerCase() === coinName.toLowerCase()
    );
  } catch (error) {
    throw new Error("Failed to validate coin name");
  }
};

module.exports = { validateCoinName };
