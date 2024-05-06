interface Coin {
  name: string;
  symbol: string;
  image: string;
  currentPrice: number;
}

interface CoinDB {
  name: string;
  amount: number;
  _id: string;
  addedAt: string;
}

interface CoinData {
  name: string;
  amount: string;
}

interface CoinResponse {
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
          image: data.image?.small,
          currentPrice: data?.market_data.current_price.usd,
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
  coinData: CoinData
): Promise<CoinResponse> => {
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

    return jsonData as CoinResponse;
  } catch (error) {
    console.error(`Failed to add coin`, error);
    throw Error;
  }
};

/** -----------------------------------------------------------------------------------------------
 * Retrieves the list of coins in the user's portfolio from the /portfolio server endpoint.
 * Only the names of the coins are returned.
 *
 * @returns Promise resolving to an array of coin names from the user's portfolio.
 */
export const fetchPortfolioList = async () => {
  try {
    const url = `http://localhost:8000/coins/portfolio`;
    const res = await fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resData = await res.json();
    const portfolioList = resData.data.map((coin: CoinDB) => coin.name);
    return portfolioList;
  } catch (error) {
    console.error(`Failed to fetch portolio list`, error);
    throw Error;
  }
};

// const addCoinToPortfolio = async () => {
//   if (!addedCoin) return;

//   const url = `https://api.coingecko.com/api/v3/coins/${addedCoin.toLowerCase()}`;
//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     const newCoin = {
//       name: data.name,
//       symbol: data.symbol,
//       image: data.image.thumb,
//       currentPrice: data.market_data.current_price.usd,
//     };
//     setPortfolio((prevState) => [...prevState, newCoin]);
//     setDialogOpen(false);
//     console.log(`${newCoin.name} has been added`);
//   } catch (error) {
//     console.error("Error fetching data for new coin:", error);
//   }
// };
