import express from "express";
import { provideFeedback, viewPastFeedback } from "../Controller/review.controller.js";
import { verifyUserJWT } from "../Middlewares/auth.middleware.js";

const router = express.Router();

// POST: Provide Feedback
router.post("/submit", verifyUserJWT, provideFeedback);

// GET: View Past Feedback
router.get("/history", verifyUserJWT, viewPastFeedback);

export default router;
