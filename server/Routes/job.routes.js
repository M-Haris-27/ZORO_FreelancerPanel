import express from "express";
import {
    browseJobs,
    searchJobs,
    submitProposal,
} from "../Controller/job.controller.js";
import { verifyUserJWT } from "../Middlewares/auth.middleware.js";

const router = express.Router();

// GET /api/jobs/browse - Browse jobs
router.get("/browse", browseJobs);

// GET /api/jobs/search - Search jobs
router.get("/search", searchJobs);

// POST /api/jobs/:id/proposals - Submit a proposal for a job
router.post("/proposals", verifyUserJWT, submitProposal);

export default router;
