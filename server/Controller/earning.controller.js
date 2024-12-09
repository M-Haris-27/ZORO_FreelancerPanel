import { Earnings } from "../Models/earnings.model.js";
import mongoose from "mongoose";

// View Earnings: Overview of total earnings, recent transactions, and pending payments
export const viewEarnings = async (req, res) => {
    try {
        const userId = req.user.id;

        // Ensure userId is converted to ObjectId for proper comparison (using 'new' keyword)
        const earnings = await Earnings.findOne({ freelancerId: new mongoose.Types.ObjectId(userId) }).populate("transactions.paymentId");

        if (!earnings) {
            return res.status(404).json({ message: "Earnings data not found" });
        }

        res.status(200).json({
            totalEarnings: earnings.totalEarnings,
            pendingPayments: earnings.pendingPayments,
            recentTransactions: earnings.transactions.slice(-5), // Last 5 transactions
        });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

// Withdraw Funds: Option to request withdrawals to a linked payment account
export const withdrawFunds = async (req, res) => {
    try {
        const userId = req.user.id; // Get the logged-in user's ID
        const { amount, paymentId } = req.body;

        // Validate input
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid withdrawal amount" });
        }

        // Fetch the earnings for the logged-in freelancer
        const earnings = await Earnings.findOne({ freelancerId: new mongoose.Types.ObjectId(userId) });

        if (!earnings) {
            return res.status(404).json({ message: "Earnings data not found" });
        }

        // Check if sufficient total earnings are available
        if (amount > earnings.totalEarnings) {
            return res.status(400).json({ message: "Insufficient earnings for withdrawal" });
        }

        // Deduct the amount from total earnings
        earnings.totalEarnings -= amount;

        // Log the withdrawal in the transactions array
        earnings.transactions.push({
            paymentId: paymentId ? new mongoose.Types.ObjectId(paymentId) : null, // Optional payment ID
            amount: amount,
            date: new Date(),
            status: "completed", // Withdrawal is treated as a completed transaction
        });

        // Save the updated earnings document
        await earnings.save();

        res.status(200).json({
            message: "Withdrawal successful",
            updatedEarnings: {
                totalEarnings: earnings.totalEarnings,
                transactions: earnings.transactions.slice(-5), // Return the last 5 transactions
            },
        });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};