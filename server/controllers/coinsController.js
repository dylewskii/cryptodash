const getAllCoins = async (req, res) => {
  try {
    const coins = await Coin.find();
    res.json(coins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addCoin = (req, res) => {
  const { name, amount } = req.body;

  if (name.length < 2) {
    res.json({ sucess: false, msg: "Coin name invalid" });
  }

  res.json({
    message: "Coin data received successfully",
    receivedData: req.body,
  });
};

module.exports = {
  getAllCoins,
  addCoin,
};
