require("dotenv").config();

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

module.exports = {
  fetchTotalMcapData,
};
