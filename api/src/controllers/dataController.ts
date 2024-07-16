import { Request, Response } from "express";
import { CoinData } from "../types";
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

// fetches all coins under the provided search term - supplied through a query param
export const fetchSearchResults = async (req: Request, res: Response) => {
  const searchTerm = req.query.searchTerm;
  if (!searchTerm) {
    return res
      .status(400)
      .json({ success: false, msg: "Search query param is missing" });
  }
  const url = `https://api.coingecko.com/api/v3/search?query=${searchTerm}`;
  const options: RequestInit = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": COINGECKO_API_KEY,
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Http Error: ${response.status}`);
    }

    const data = await response.json();
    return res.json({ data });
  } catch (err) {
    console.error("Error fetching results for provided search query :", err);
    return res
      .status(500)
      .json({ success: false, msg: "Failed to run search" });
  }
};
