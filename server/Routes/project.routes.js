import express from "express";
import { viewActiveProjects, submitWork } from "../Controller/project.controller.js";
import { verifyUserJWT } from "../Middlewares/auth.middleware.js";

const router = express.Router();

// GET: View Active Projects (where status is "in-progress")
router.get("/active-projects", verifyUserJWT, viewActiveProjects);

// POST: Submit Work
router.post("/submit", verifyUserJWT, submitWork);

export default router;
