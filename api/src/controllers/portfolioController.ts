import { Request, Response } from "express";
import { User } from "../models/User";
import { isCoinIdValid } from "../services/coinServices";

interface RequestUser {
  id?: string; // mongoose.Types.ObjectId ?
}

interface AuthenticatedRequest extends Request {
  user?: RequestUser;
}

export const getPortfolio = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        success: false,
        msg: "User ID could not be extracted from req.user",
      });
    }

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
  } catch (err: any) {
    console.error("Failed to retrieve portfolio:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPortfolioValues = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        success: false,
        msg: "User ID could not be extracted from req.user",
      });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    res.json({ success: true, data: user.portfolioValues });
  } catch (err: any) {
    console.error("Failed to retrieve portfolio values:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addCoin = async (req: AuthenticatedRequest, res: Response) => {
  const { id, amount } = req.body;

  if (!req.user) {
    return res.status(400).json({
      success: false,
      msg: "User ID could not be extracted from req.user",
    });
  }

  const userId = req.user.id;

  // check if coin id is valid (i.e exists within API)
  const isValidCoinId = await isCoinIdValid(id);
  if (!isValidCoinId) {
    return res.status(400).json({ success: false, msg: "Invalid coin ID" });
  }

  if (!amount || !id) {
    return res.status(400).json({
      success: false,
      msg: "Please enter a valid coin and amount.",
    });
  }

  if (Number(amount) < 0) {
    return res
      .status(400)
      .json({ success: false, msg: "Please enter a positive holding amount." });
  }

  // convert amount to float num
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) {
    return res
      .status(400)
      .json({ success: false, msg: "Please enter a valid holding amount." });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const coinAlreadyAddedToPortfolio = user.portfolio.some((coin) => {
      return id === coin.id;
    });

    if (coinAlreadyAddedToPortfolio) {
      console.log("Coin already exists within portfolio.");
      return res.status(409).json({
        success: false,
        msg: "Coin already exists within portfolio.",
      });
    }

    // add coin to user's portfolio array
    const newCoin = { id, amount: numericAmount };
    user.portfolio.push(newCoin);

    await user.save();

    const io = req.app.get("socketio");
    io.emit("portfolioUpdated", { userId, portfolio: user.portfolio });

    res.json({
      success: true,
      message: "Coin added to portfolio successfully",
      coinData: newCoin,
    });
  } catch (err: any) {
    console.error("Failed to add coin:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCoin = async (req: AuthenticatedRequest, res: Response) => {
  const { coinId } = req.body;

  if (!coinId) {
    return res
      .status(400)
      .json({ success: false, msg: "Coin ID is required." });
  }

  if (!req.user) {
    return res.status(400).json({
      success: false,
      msg: "User ID could not be extracted from req.user",
    });
  }

  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const coinExists = user.portfolio.some((coin) => coin.id === coinId);
    if (!coinExists) {
      return res
        .status(404)
        .json({ success: false, msg: "Coin not found within portfolio" });
    }

    // $pull removes the coin from the user's portfolio
    const result = await User.updateOne(
      { _id: userId },
      { $pull: { portfolio: { id: coinId } } }
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
    if (!updatedUser) {
      throw new Error("Unable to find updated user in mongodb");
    }
    if (updatedUser.portfolio.length === 0) {
      // reset the portfolio to empty array
      await User.updateOne({ _id: userId }, { $set: { portfolio: [] } });
    }

    const io = req.app.get("socketio");
    io.emit("portfolioUpdated", { userId, portfolio: updatedUser.portfolio });

    res.json({
      success: true,
      msg: `Coin deletion completed - ${coinId} removed from portfolio`,
    });
  } catch (err: any) {
    console.error("Failed to delete coin:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const editCoin = async (req: AuthenticatedRequest, res: Response) => {
  const { coinId, editedAmount } = req.body;

  if (!coinId || !editedAmount) {
    return res
      .status(400)
      .json({ success: false, msg: "Coin ID and Edited Amount are required." });
  }

  if (isNaN(Number(editedAmount)) || Number(editedAmount) < 0) {
    return res.status(400).json({
      success: false,
      msg: "Invalid amount. Please provide a non-negative number.",
    });
  }

  if (!req.user) {
    return res.status(400).json({
      success: false,
      msg: "User ID could not be extracted from req.user",
    });
  }
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const coin = user.portfolio.find((c) => c.id === coinId);
    if (!coin) {
      return res.status(404).json({
        success: false,
        msg: "Coin not found in portfolio",
      });
    }

    coin.amount = editedAmount;
    await user.save();

    const io = req.app.get("socketio");
    io.emit("portfolioUpdated", { userId, portfolio: user.portfolio });

    res.status(200).json({
      success: true,
      msg: "Coin amount updated successfully",
      portfolio: user.portfolio,
    });
  } catch (err: any) {
    console.error("Failed to edit coin:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
