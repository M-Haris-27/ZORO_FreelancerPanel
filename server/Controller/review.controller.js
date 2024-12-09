import { Review } from "../Models/review.model.js";
import { Job } from "../Models/job.model.js";
import mongoose from "mongoose";

export const provideFeedback = async (req, res) => {
    try {
        const { jobId, clientId, rating, feedback } = req.body;
        const freelancerId = req.user.id; // Get logged-in freelancer's ID

        // Convert IDs to ObjectId
        const jobObjectId = new mongoose.Types.ObjectId(jobId);
        const clientObjectId = new mongoose.Types.ObjectId(clientId);
        const freelancerObjectId = new mongoose.Types.ObjectId(freelancerId);

        // Ensure the job is completed before allowing feedback
        const job = await Job.findById(jobObjectId);

        if (!job || job.status !== "completed") {
            return res.status(400).json({
                message: "Feedback can only be provided for completed jobs.",
            });
        }

        // Check if feedback already exists for the job
        const existingReview = await Review.findOne({
            jobId: jobObjectId,
            clientId: clientObjectId,
        });

        if (existingReview) {
            return res.status(400).json({
                message: "Feedback for this job has already been submitted.",
            });
        }

        // Create a new review
        const review = new Review({
            jobId: jobObjectId,
            clientId: clientObjectId,
            freelancerId: freelancerObjectId,
            rating,
            feedback,
        });

        await review.save();

        res.status(201).json({ message: "Feedback submitted successfully.", review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View Past Feedback
export const viewPastFeedback = async (req, res) => {
    try {
        const userId = req.user.id; // Get logged-in user's ID
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Fetch feedbacks related to the user
        const reviews = await Review.find({
            $or: [{ clientId: userObjectId }, { freelancerId: userObjectId }],
        })
            .populate("jobId", "title")
            .populate("clientId", "firstName lastName")
            .populate("freelancerId", "firstName lastName")
            .sort({ createdAt: -1 })
            .exec();

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: "No feedback found." });
        }

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
