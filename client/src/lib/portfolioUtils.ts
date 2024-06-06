// ------------------------------- TYPES -------------------------------
interface imageData {
  thumb: string;
  sm: string;
  lg: string;
}

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: imageData;
  currentPrice: number;
  marketCap: number;
  ath: number;
  webSlug: string;
}

interface CoinDB {
  id: string;
  amount: number;
  _id: string;
  addedAt: string;
}

interface CoinAdditionData {
  id: string;
  amount: string;
}

interface CoinAdditionResponse {
  success: boolean;
  message: string;
  coinData: {
    amount: string;
    id: string;
  };
}

/** -----------------------------------------------------------------------------------------------
 * Sends GET request to API for each coin found in the provided array argument.
 * Handles API failures by returning null for failed requests and filtering out null values from the final result.
 *
 * @param coins String array of coins names to fetch details for.
 * @returns Promise resolving to an array of Coin objects with details from CoinGecko.
 */
export const fetchPortfolioCoinData = async (
  coins: string[]
): Promise<Coin[]> => {
  const fetchCoinData = async (coin: string): Promise<Coin | null> => {
    const url = `http://localhost:8000/data/portfolio-coin-data?coin=${coin}`;

    try {
      const response = await fetch(url, { credentials: "include" });
      const data = await response.json();
      return {
        id: data.data.id,
        name: data.data.name,
        symbol: data.data.symbol,
        image: {
          thumb: data.data.image.thumb,
          sm: data.data.image.small,
          lg: data.data.image.large,
        },
        currentPrice: data.data.market_data.current_price.usd,
        marketCap: data.data.market_data.market_cap.usd,
        ath: data.data.market_data.ath.usd,
        webSlug: data.data.market_data.web_slug,
      };
    } catch (error) {
      console.error("Error fetching portfolio data for coin:", coin, error);
      return null; // return null to indicate failure
    }
  };

  const requests = coins.map(fetchCoinData);
  const results = await Promise.all(requests);
  // filter out null results to handle failed requests
  // assert coin type
  const filteredResults = results.filter((coin): coin is Coin => coin !== null);
  return filteredResults;
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
