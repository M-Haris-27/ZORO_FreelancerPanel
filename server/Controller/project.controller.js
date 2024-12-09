import { Job } from "../Models/job.model.js"; //import the Job model
import { WorkSubmission } from "../Models/workSubmission.model.js"; //import the WorkSubmission model

// View Active Projects
export const viewActiveProjects = async (req, res) => {
    try {

        // Fetch active jobs where the status is 'in-progress'
        const activeProjects = await Job.find({
            status: "in-progress",
        })
            .populate("clientId", "firstName lastName email")
            .exec();

        if (!activeProjects || activeProjects.length === 0) {
            return res.status(404).json({ message: "No active projects found." });
        }

        res.status(200).json(activeProjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Submit Work
export const submitWork = async (req, res) => {
    try {
        const { jobId, links, notes } = req.body;
        const freelancerId = req.user.id; // Get freelancer ID from the authenticated user

        // Create a new work submission
        const submission = new WorkSubmission({
            jobId,
            freelancerId,
            links,
            notes,
        });

        await submission.save();

        // Update the job status to 'completed'
        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            { status: "completed" },
            { new: true } // Return the updated document
        );

        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found." });
        }

        res.status(201).json({
            message: "Work submitted successfully. Job status updated to 'completed'.",
            submission,
            updatedJob,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
