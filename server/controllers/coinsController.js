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

const deleteCoin = async (req, res) => {
  const { coinName } = req.body;
  const userId = req.user.id;
  const coinToDelete = coinName.toLowerCase();

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const coinExists = user.portfolio.some(
      (coin) => coinToDelete === coin.name
    );
    if (!coinExists) {
      return res
        .status(404)
        .json({ success: false, msg: "Coin not found within portfolio" });
    }

    // $pull removes the coin from the user's portfolio
    const result = await User.updateOne(
      { _id: userId },
      { $pull: { portfolio: { name: coinToDelete } } }
    );

    // check if deletion was successful
    // if modifiedCount is 0 -> no documents were changed during the operation (i.e deletion failed)
    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        msg: "Coin deletion failed or already removed from portfolio ",
      });
    }

    // check if the portfolio is now empty and handle appropriately
    const updatedUser = await User.findById(userId);
    if (updatedUser.portfolio.length === 0) {
      // reset the portfolio to empty array
      await User.updateOne({ _id: userId }, { $set: { portfolio: [] } });
    }

    res.json({
      msg: `Coin deletion completed - ${coinToDelete} removed from portfolio`,
    });
  } catch (err) {
    console.error("Failed to delete coin:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getPortfolio,
  addCoin,
  deleteCoin,
};
