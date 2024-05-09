// ------------------------------- TYPES -------------------------------
interface Coin {
  name: string;
  symbol: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  ath: number;
}

interface CoinDB {
  name: string;
  amount: number;
  _id: string;
  addedAt: string;
}

interface CoinAdditionData {
  name: string;
  amount: string;
}

interface CoinAdditionResponse {
  success: boolean;
  message: string;
  coinData: {
    name: string;
    amount: string;
  };
}

/** -----------------------------------------------------------------------------------------------
 * Sends GET request to CoinGecko for each coin found in the provided array argument.
 * Handles API failures by returning null for failed requests and filtering out null values from the final result.
 *
 * @param coins String array of coins names to fetch details for.
 * @returns Promise resolving to an array of Coin objects with details from CoinGecko.
 */
export const fetchPortfolioCoinData = async (coins: string[]) => {
  const requests = coins.map((coin) => {
    const url = `https://api.coingecko.com/api/v3/coins/${coin}`;

    return fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        return {
          name: data.name,
          symbol: data.symbol,
          image: data.image.small,
          currentPrice: data?.market_data.current_price.usd,
          marketCap: data.market_data.market_cap.usd,
          ath: data.market_data.ath.usd,
        };
      })
      .catch((error) => {
        console.error("Error fetching portfolio data:", error);
        return null; // null results filtered out below
      });
  });

  return Promise.all(requests)
    .then((results) => {
      // filter out null results to handle failed requests
      const filteredResults = results.filter(
        (result): result is Coin => result !== null
      );
      return filteredResults;
    })
    .catch((error) => {
      console.error("Error with Promise.all:", error);
      throw error;
    });
};

/** -----------------------------------------------------------------------------------------------
 * Sends a POST request to /add endpoint - returns Promise confirming whether coin was added to DB
 *
 * @param coinData data of the coin to add (name and amount).
 * @returns Promise resolving to the response from the server confirming if successful.
 */
export const sendAddCoinPostReq = async (
  coinData: CoinAdditionData
): Promise<CoinAdditionResponse> => {
  const url = `http://localhost:8000/coins/add`;

  try {
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(coinData),
    });

    if (!res.ok) {
      throw new Error(`HTTP error. status: ${res.status}`);
    }

    const jsonData = await res.json();
    if (!jsonData.success) {
      throw new Error("Response was not successful");
    }

    return jsonData as CoinAdditionResponse;
  } catch (error) {
    console.error(`Failed to add coin`, error);
    throw Error;
  }
};

/** -----------------------------------------------------------------------------------------------
 * Retrieves an array of coin objects found in the user's portfolio from the /portfolio endpoint.
 * The coin name, amount, addedAt and _id are returned
 *
 * @returns Promise resolving to an array of objects containing the coin's name, amount, addedAt & _id
 */
export const fetchPortfolio = async (): Promise<CoinDB[]> => {
  try {
    const url = `http://localhost:8000/coins/portfolio`;
    const res = await fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // const portfolioList = resData.data.map((coin: CoinDB) => coin.name);
    const resData = await res.json();
    if (!resData.success) {
      throw new Error(
        `Fetching portfolio from /portfolio failed: ${resData.msg}`
      );
    }

    return resData.data;
  } catch (error) {
    console.error(`Failed to fetch portolio list`, error);
    throw Error;
  }
};
