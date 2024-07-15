// ------------------------------- INTERFACE / TYPES -------------------------------
import { API_BASE_URL } from "@/config";
import { DetailedCoin, UndetailedCoin, CoinDB, PortfolioType } from "@/types";

interface CoinAdditionData {
  id: string;
  amount: string;
}

interface CoinAdditionResponse {
  success: boolean;
  msg: string;
  coinData: {
    amount: string;
    id: string;
  };
}

interface DataItem {
  timestamp: string;
  value: number;
}

/** -----------------------------------------------------------------------------------------------
 * Retrieves an array of coin objects found in the user's portfolio from the /portfolio endpoint.
 * The coin name, amount, addedAt and _id are returned
 *
 * @returns Promise resolving to an array of objects containing the coin's name, amount, addedAt & _id
 */
export const fetchPortfolio = async (
  accessToken: string
): Promise<CoinDB[]> => {
  try {
    const url = `${API_BASE_URL}/portfolio/all-coins`;
    const res = await fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // const portfolioList = resData.data.map((coin: CoinDB) => coin.name);
    const data = await res.json();
    if (!data.success) {
      throw new Error(`Fetching portfolio from /portfolio failed: ${data.msg}`);
    }

    return data.data;
  } catch (error) {
    console.error(`Failed to fetch portolio list`, error);
    throw Error;
  }
};

/** -----------------------------------------------------------------------------------------------
 * Sends GET request to API for each coin found in the provided array argument.
 * Handles API failures by returning null for failed requests and filtering out null values from the final result.
 *
 * @param coins String array of coins names to fetch details for.
 * @returns Promise resolving to an array of Coin objects with details from CoinGecko.
 */
export const fetchPortfolioCoinData = async (
  coins: string[],
  accessToken: string
): Promise<UndetailedCoin[]> => {
  const fetchCoinData = async (
    coin: string
  ): Promise<UndetailedCoin | null> => {
    const url = `${API_BASE_URL}/data/portfolio-coin-data?coin=${coin}`;

    const options: RequestInit = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await fetch(url, options);
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
        description: data.data.description.en,
        links: data.data.links,
        genesis_date: data.data.genesis_date,
        market_cap_rank: data.data.market_data.market_cap_rank,
        fully_diluted_valuation:
          data.data.market_data.fully_diluted_valuation.usd,
        price_change_percentage_24h:
          data.data.market_data.price_change_percentage_24h,
        price_change_percentage_7d:
          data.data.market_data.price_change_percentage_7d,
        total_supply: data.data.market_data.total_supply,
        max_supply: data.data.market_data.max_supply,
        circulating_supply: data.data.market_data.circulating_supply,
        sparkline: data.data.market_data.sparkline_7d.price,
      };
    } catch (error) {
      console.error("Error fetching portfolio data for coin:", coin, error);
      return null; // return null to indicate failure
    }
  };

  const requests = coins.map((coin) => fetchCoinData(coin));
  const results = await Promise.all(requests);
  // filter out null results to handle failed requests
  // assert coin type
  const filteredResults = results.filter(
    (coin): coin is UndetailedCoin => coin !== null
  );
  return filteredResults;
};

export const fetchAndCombinePortfolioData = async (
  userId: string,
  accessToken: string
): Promise<PortfolioType> => {
  if (!userId || !accessToken) {
    throw new Error("User ID and access token are required");
  }

  try {
    // fetch array of coin objects from user's portfolio
    const portfolioObjects = await fetchPortfolio(accessToken);

    // extract coin names into a string array
    const portfolioCoinNameList = portfolioObjects.map((coin) => coin.id);

    // fetch detailed data for each coin (price, ath, marketCap etc)
    const detailedCoinsArray = await fetchPortfolioCoinData(
      portfolioCoinNameList,
      accessToken
    );

    // combine amount data w/ detailed coin data
    const combinedDetailedCoins: DetailedCoin[] = detailedCoinsArray.map(
      (coin) => {
        // find the corresponding coin object from the user's portfolio based on the coin id
        const foundCoin = portfolioObjects.find(
          (item) => item.id.toLowerCase() === coin.id.toLowerCase()
        );

        const amount = foundCoin ? foundCoin.amount : 0;
        const currentPrice = coin.currentPrice || 0;
        const totalValue = amount * currentPrice;

        // return a new object for each coin combining the detailed API data with the amount from the user's portfolio
        return {
          id: coin.id,
          name: coin.name,
          amount: foundCoin ? foundCoin.amount.toString() : "0",
          totalValue,
          info: {
            symbol: coin.symbol,
            image: coin.image,
            currentPrice: coin.currentPrice,
            marketCap: coin.marketCap,
            ath: coin.ath,
            webSlug: coin.webSlug,
            description: coin.description,
            links: coin.links,
            genesis_date: coin.genesis_date,
            market_cap_rank: coin.market_cap_rank,
            fully_diluted_valuation: coin.fully_diluted_valuation,
            price_change_percentage_24h: coin.price_change_percentage_24h,
            price_change_percentage_7d: coin.price_change_percentage_7d,
            total_supply: coin.total_supply,
            max_supply: coin.max_supply,
            circulating_supply: coin.circulating_supply,
            sparkline: coin.sparkline,
          },
        };
      }
    );

    return {
      list: portfolioCoinNameList,
      detailed: combinedDetailedCoins,
    };
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    throw error;
  }
};

/** -----------------------------------------------------------------------------------------------
 * Sends a GET request to /portfolio-values endpoint - returns Promise resolving to an array of
 * objects which hold hourly information on the user's portfolio values.
 *
 * @returns Promise resolving to an array of objects which hold hourly information on the user's
 * portfolio values.
 */
export const fetchPortfolioValues = async (accessToken: string) => {
  const url = `${API_BASE_URL}/portfolio/portfolio-values`;
  const options: RequestInit = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.msg || "Unknown error");
    }

    return data.data;
  } catch (err) {
    throw new Error(`Failed to send GET portfolio values request: ${err}`);
  }
};

/** -----------------------------------------------------------------------------------------------
 * Sorts the data based on the date objects derived from timestamp.
 *
 * @returns timestamp sorted data
 */
export const sortDataByTimestamp = (data: DataItem[]): DataItem[] => {
  const sortedData: DataItem[] = data.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return sortedData;
};

/** -----------------------------------------------------------------------------------------------
 * Sends a POST request to /add endpoint - returns Promise confirming whether coin was added to DB
 *
 * @param coinData data of the coin to add (name and amount).
 * @returns Promise resolving to the response from the server confirming if successful.
 */
export const sendAddCoinPostReq = async (
  coinData: CoinAdditionData,
  accessToken: string
): Promise<CoinAdditionResponse> => {
  const url = `${API_BASE_URL}/portfolio/add`;
  const options: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(coinData),
  };

  try {
    const res = await fetch(url, options);

    if (res.status === 409) {
      return {
        success: false,
        msg: "Coin already exists within portfolio",
        coinData: {
          amount: "",
          id: "",
        },
      };
    }

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.msg || "Unknown error");
    }

    return data as CoinAdditionResponse;
  } catch (err) {
    throw new Error(`Send add coin request failed :${err}`);
  }
};

/** -----------------------------------------------------------------------------------------------
 * Converts provided coin parameter into a DetailedCoin type.
 *
 * @param coin data of the coin to convert (UndetailedCoin fetched from API)
 * @returns object in the format of DetailedCoin
 */
export const adaptToPortfolioCoinType = (coin: UndetailedCoin) => {
  return {
    id: coin.id,
    name: coin.name,
    amount: "0",
    totalValue: 0,
    info: {
      symbol: coin.symbol,
      image: coin.image,
      currentPrice: coin.currentPrice,
      marketCap: coin.marketCap,
      ath: coin.ath,
      webSlug: coin.webSlug,
      description: coin.description,
      links: coin.links,
      genesis_date: coin.genesis_date,
      market_cap_rank: coin.market_cap_rank,
      fully_diluted_valuation: coin.fully_diluted_valuation,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      price_change_percentage_7d: coin.price_change_percentage_7d,
      total_supply: coin.total_supply,
      max_supply: coin.max_supply,
      circulating_supply: coin.circulating_supply,
      sparkline: coin.sparkline,
    },
  };
};
