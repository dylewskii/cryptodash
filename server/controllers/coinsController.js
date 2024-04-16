const getAllCoins = async (req, res) => {
  try {
    const coins = await Coin.find();
    res.json(coins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = getAllCoins;
