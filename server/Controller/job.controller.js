import { Job } from "../Models/job.model.js";
import { Proposal } from "../Models/proposal.model.js"; // Assuming a Proposal model exists
import { AsyncHandler } from "../Utils/AsyncHandler.js";


// Browse jobs with optional filters
export const browseJobs = AsyncHandler(async (req, res) => {
    const { skills, budget, duration } = req.query;
    const filter = {};

    if (skills) filter.skillsRequired = { $in: skills.split(",") };
    if (budget) filter.budget = { $lte: Number(budget) };
    if (duration) filter.duration = duration;

    const jobs = await Job.find(filter).where("status").equals("open").exec();
    res.status(200).json({ success: true, jobs });
});

// Search jobs with keywords and optional filters
export const searchJobs = AsyncHandler(async (req, res) => {
    const { keyword, skills, budget, duration } = req.query;
    const filter = {};

    // Add keyword-based search
    if (keyword) {
        filter.$or = [
            { title: new RegExp(keyword, "i") },
            { description: new RegExp(keyword, "i") },
        ];
    }

    // Add optional filters
    if (skills) filter.skillsRequired = { $in: skills.split(",") };
    if (budget) filter.budget = { $lte: Number(budget) };
    if (duration) filter.duration = duration;

    const jobs = await Job.find(filter).where("status").equals("open").exec();
    res.status(200).json({ success: true, jobs });
});

// Controller function for submitting a job proposal
export const submitProposal = AsyncHandler(async (req, res) => {
    const { jobId, coverLetter, expectedBudget } = req.body;
    const freelancerId = req.user.id; // Assuming verifyUserJWT adds user info to req

    // Validate inputs
    if (!jobId || !coverLetter || !expectedBudget) {
        return res.status(400).json({
            success: false,
            message: "Job ID, cover letter, and expected budget are required.",
        });
    }

    // Check if the job exists and is open
    const job = await Job.findById(jobId).where("status").equals("open");
    if (!job) {
        return res.status(404).json({
            success: false,
            message: "Job not found or no longer open for proposals.",
        });
    }

    // Check if the freelancer has already submitted a proposal for this job
    const existingProposal = await Proposal.findOne({ jobId, freelancerId });
    if (existingProposal) {
        return res.status(409).json({
            success: false,
            message: "You have already submitted a proposal for this job.",
        });
    }

    // Save the proposal
    const newProposal = await Proposal.create({
        jobId,
        freelancerId,
        coverLetter,
        expectedBudget,
        status: "pending",
    });

    res.status(201).json({
        success: true,
        message: "Proposal submitted successfully.",
        proposal: newProposal,
    });
});
