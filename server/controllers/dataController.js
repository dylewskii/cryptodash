require("dotenv").config();

const fetchPortfolioCoinData = async (req, res) => {
  // extract the coin query param
  const coinName = req.query.coin;
  if (!coinName) {
    return res
      .status(400)
      .json({ success: false, message: "No coin specified" });
  }

  const url = `https://api.coingecko.com/api/v3/coins/${coinName}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error(
      `Error fetching coin data (for ${coinName}) from CoinGecko:`,
      error
    );
  }
};

const fetchTotalMcapData = async (req, res) => {
  const url = "https://api.coingecko.com/api/v3/global";

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    res.status(200).json({
      success: true,
      data: data.data.total_market_cap,
    });
  } catch (err) {
    console.error("Failed to retrieve total mcap data:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const fetchAllCoins = async (req, res) => {
  const url = "https://api.coingecko.com/api/v3/coins/list";

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
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

const fetchAllCoinsWithMarketData = async (req, res) => {
  const { page = 1 } = req.query;

  const url = `https://api.coingecko.com/api/v3/coins/markets`;
  const queryParams = `?vs_currency=usd&order=market_cap_desc&sparkline=true&page=${page}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
    },
  };

  try {
    const response = await fetch(`${url}${queryParams}`, options);
    const data = await response.json();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
    throw new Error("Failed to fetch coin list w/ market data from CG");
  }
};

// recursive paginated fetch
// const fetchAllCoinsWithMarketData = async (req, res) => {
//   const paginatedFetch = async (url, page = 1, previousResponse = []) => {
//     try {
//       const response = await fetch(`${url}&page=${page}`, {
//         method: "GET",
//         headers: {
//           accept: "application/json",
//           "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
//         },
//       });
//       const newResponse = await response.json();
//       const combinedResponse = [...previousResponse, ...newResponse];

//       if (newResponse.length !== 0) {
//         return paginatedFetch(url, page + 1, combinedResponse);
//       }

//       return combinedResponse;
//     } catch (error) {
//       console.error("Failed to fetch paginated data:", error);
//       throw new Error("Failed to fetch paginated data");
//     }
//   };

//   const baseUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250`;

//   try {
//     const allCoins = await paginatedFetch(baseUrl);

//     res.status(200).json({
//       success: true,
//       data: allCoins,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, msg: err.message });
//     console.error("Failed to fetch coin list with market data from CG:", err);
//   }
// };

module.exports = {
  fetchPortfolioCoinData,
  fetchTotalMcapData,
  fetchAllCoins,
  fetchAllCoinsWithMarketData,
};
