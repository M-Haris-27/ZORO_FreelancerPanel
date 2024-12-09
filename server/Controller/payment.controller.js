import { Payment } from "../Models/payment.model.js";
import { Job } from "../Models/job.model.js";

// Make Payment
export const makePayment = async (req, res) => {
    try {
        const { jobId, clientId, freelancerId, amount } = req.body;

        // Create a new payment record
        const payment = new Payment({
            jobId,
            clientId,
            freelancerId,
            amount,
        });

        await payment.save();

        // Simulate payment gateway integration (for now, set status to 'completed')
        payment.status = "completed";
        await payment.save();

        res.status(201).json({ message: "Payment processed successfully.", payment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View Payment History
export const viewPaymentHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch payments made by or to the user
        const payments = await Payment.find({
            $or: [{ clientId: userId }, { freelancerId: userId }],
        })
            .populate("jobId", "title")
            .populate("clientId", "firstName lastName email")
            .populate("freelancerId", "firstName lastName email")
            .sort({ createdAt: -1 })
            .exec();

        if (!payments || payments.length === 0) {
            return res.status(404).json({ message: "No payment history found." });
        }

        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Release Payment
export const releasePayment = async (req, res) => {
    try {
        const { paymentId } = req.body;

        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({ message: "Payment not found." });
        }

        if (payment.status !== "pending") {
            return res.status(400).json({ message: "Payment is not in a releasable state." });
        }

        // Update payment status to 'completed'
        payment.status = "completed";
        await payment.save();

        res.status(200).json({ message: "Payment released successfully.", payment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
