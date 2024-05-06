const User = require("../models/User");

const getPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    res.status(200).json({
      success: true,
      msg:
        user.portfolio.length > 0
          ? "Portfolio retrieved successfully"
          : "Portfolio is empty",
      data: user.portfolio,
    });
  } catch (err) {
    console.error("Failed to retrieve portfolio:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const addCoin = async (req, res) => {
  const { name, amount } = req.body;
  const userId = req.user.id;

  // check if coin name is valid - i.e not shorter than 1 character
  if (name.length < 1) {
    res.json({ sucess: false, msg: "Coin name invalid" });
    return;
  }

  // convert amount to float num
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) {
    return res
      .status(400)
      .json({ success: false, msg: "Amount must be a number." });
  }

  try {
    const user = await User.findById(userId);

    const coinAlreadyAddedToPortfolio = user.portfolio.some((coin) => {
      return name === coin.name;
    });

    if (coinAlreadyAddedToPortfolio) {
      console.log("Coin already exists within portfolio.");
      return res.status(409).json({
        success: false,
        msg: "Coin already exists within portfolio.",
      });
    }

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // add coin to user's portfolio array
    const newCoin = { name, amount: numericAmount };
    user.portfolio.push(newCoin);

    await user.save();

    res.json({
      success: true,
      message: "Coin added to portfolio successfully",
      coinData: newCoin,
    });
  } catch (err) {
    console.error("Failed to add coin:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getPortfolio,
  addCoin,
};
