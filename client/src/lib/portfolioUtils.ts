interface Coin {
  name: string;
  symbol: string;
  image: string;
  currentPrice: number;
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

export const fetchPortfolioCoinData = async (coins: string[]) => {
  const requests = coins.map((coin) => {
    const url = `https://api.coingecko.com/api/v3/coins/${coin}`;

    return fetch(url)
      .then((res) => res.json())
      .then((data) => {
        return {
          name: data.name,
          symbol: data.symbol,
          image: data.image.small,
          currentPrice: data.market_data.current_price.usd,
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

export const fetchUserPortfolioList = async () => {};

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
