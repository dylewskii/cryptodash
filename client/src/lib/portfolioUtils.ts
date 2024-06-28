// ------------------------------- INTERFACE / TYPES -------------------------------
interface ImageData {
  thumb: string;
  sm: string;
  lg: string;
}

interface Links {
  homepage: string[];
  whitepaper: string;
  blockchain_site: string[];
  official_forum_url: string[];
  chat_url: string[];
  announcement_url: string[];
  twitter_screen_name: string;
  facebook_username: string;
  bitcointalk_thread_identifier: null | string;
  telegram_channel_identifier: string;
  subreddit_url: string;
  repos_url: {
    github: string[];
    bitbucket: string[];
  };
}

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: ImageData;
  currentPrice: number;
  marketCap: number;
  ath: number;
  webSlug: string;
  description: string;
  links: Links;
  genesis_date: string;
  market_cap_rank: number;
  fully_diluted_valuation: string;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  total_supply: number;
  max_supply: number;
  circulating_supply: number;
  sparkline: number[];
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
  msg: string;
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
  const url = `http://localhost:8000/portfolio/add`;

  try {
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(coinData),
    });

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
    throw new Error(`Send add coin request failed ${err}`);
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
    const url = `http://localhost:8000/portfolio/all-coins`;
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
