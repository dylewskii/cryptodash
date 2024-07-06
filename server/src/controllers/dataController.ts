import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const { COINGECKO_API_KEY } = process.env;

if (!COINGECKO_API_KEY) {
  throw new Error("CG API key is not defined in the environment variables");
}

// fetches data for a given coin - coinId is supplied through a query param
export const fetchPortfolioCoinData = async (req: Request, res: Response) => {
  // extract the coin query param
  const coinId = req.query.coin;
  if (!coinId) {
    return res
      .status(400)
      .json({ success: false, message: "No coin specified" });
  }

  const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;
  const queryParams = `?sparkline=true`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": COINGECKO_API_KEY,
    },
  };

  try {
    const response = await fetch(`${url}${queryParams}`, options);
    const data = await response.json();

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error(
      `Error fetching coin data (for ${coinId}) from CoinGecko:`,
      error
    );
  }
};

// fetches the total crypto market cap data
export const fetchTotalMcapData = async (req: Request, res: Response) => {
  const url = "https://api.coingecko.com/api/v3/global";

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-cg-demo-api-key": COINGECKO_API_KEY,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    res.status(200).json({
      success: true,
      data: data.data.total_market_cap,
    });
  } catch (err: any) {
    console.error("Failed to retrieve total mcap data:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// fetches all coins from CG - with no market data (name, id, symbol)
export const fetchAllCoins = async (req: Request, res: Response) => {
  const url = "https://api.coingecko.com/api/v3/coins/list";

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-cg-demo-api-key": COINGECKO_API_KEY,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res
      .status(200)
      .json({ success: true, msg: "Retrieved all coins successfully", data });
  } catch (error) {
    console.error("Error fetching coin list from CG:", error);
    throw new Error("Failed to fetch coin list from CG");
  }
};

// paginated fetch - page nr is supplied through a query param
export const fetchAllCoinsWithMarketDataPaginated = async (
  req: Request,
  res: Response
) => {
  const { page = 1 } = req.query;

  const url = `https://api.coingecko.com/api/v3/coins/markets`;
  const queryParams = `?vs_currency=usd&order=market_cap_desc&sparkline=true&page=${page}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": COINGECKO_API_KEY,
    },
  };

  try {
    const response = await fetch(`${url}${queryParams}`, options);
    const data = await response.json();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, msg: err.message });
    throw new Error("Failed to fetch coin list w/ market data from CG");
  }
};

interface CoinData {
  id: "bitcoin";
  symbol: "btc";
  name: "Bitcoin";
  image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400";
  current_price: 70187;
  market_cap: 1381651251183;
  market_cap_rank: 1;
  fully_diluted_valuation: 1474623675796;
  total_volume: 20154184933;
  high_24h: 70215;
  low_24h: 68060;
  price_change_24h: 2126.88;
  price_change_percentage_24h: 3.12502;
  market_cap_change_24h: 44287678051;
  market_cap_change_percentage_24h: 3.31157;
  circulating_supply: 19675987;
  total_supply: 21000000;
  max_supply: 21000000;
  ath: 73738;
  ath_change_percentage: -4.77063;
  ath_date: "2024-03-14T07:10:36.635Z";
  atl: 67.81;
  atl_change_percentage: 103455.83335;
  atl_date: "2013-07-06T00:00:00.000Z";
  roi: null;
  last_updated: "2024-04-07T16:49:31.736Z";
}

// recursive fetch - returns all coins from CG w/ market data
export const fetchAllCoinsWithMarketDataRecursive = async (
  req: Request,
  res: Response
) => {
  const paginatedFetch = async <T extends CoinData>(
    url: string,
    page: number = 1,
    previousResponse: T[] = []
  ): Promise<T[]> => {
    try {
      const response = await fetch(`${url}&page=${page}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": COINGECKO_API_KEY,
        },
      });
      const newResponse = await response.json();
      const combinedResponse = [...previousResponse, ...newResponse];

      if (newResponse.length !== 0) {
        return paginatedFetch(url, page + 1, combinedResponse);
      }

      return combinedResponse;
    } catch (err: any) {
      console.error("Failed to fetch paginated data:", err);
      throw new Error("Failed to fetch paginated data");
    }
  };

  const baseUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250`;

  try {
    const allCoins = await paginatedFetch(baseUrl);

    res.status(200).json({
      success: true,
      data: allCoins,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, msg: err.message });
    console.error("Failed to fetch coin list with market data from CG:", err);
  }
};
