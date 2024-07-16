interface CGCoin {
  symbol: string;
  id: string;
  name: string;
}

/**
 * Validates if a coin exists within the CoinGecko API - returns true or false
 * @param {string} coinName string name of coin to validate
 * @returns {Promise<boolean>} a promise that resolves to true if coin exists or false otherwise
 */
export const isCoinNameValid = async (coinName: string): Promise<boolean> => {
  const url = "https://api.coingecko.com/api/v3/coins/list";
  const options: RequestInit = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
    } as HeadersInit,
  };

  try {
    const response = await fetch(url, options);
    const validCoins = await response.json();

    return validCoins.some(
      (coin: CGCoin) => coin.name.toLowerCase() === coinName.toLowerCase()
    );
  } catch (error) {
    throw new Error("Failed to validate coin name");
  }
};

export const isCoinIdValid = async (coinId: string) => {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;
  const options: RequestInit = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
    } as HeadersInit,
  };

  try {
    const response = await fetch(url, options);

    if (response.status !== 200) {
      return false;
    }
    return true;
  } catch (error) {
    throw new Error("Failed to validate coin name");
  }
};
