import express from "express";
import {
    createProfile,
    updateProfile,
    deleteProfile,
    getProfile,
} from "../Controller/profile.controller.js";
import { verifyUserJWT } from "../Middlewares/auth.middleware.js";

const router = express.Router();

// Get profile details
router.get("/", verifyUserJWT, getProfile);

// Create profile
router.post("/", verifyUserJWT, createProfile);

// Update profile
router.put("/", verifyUserJWT, updateProfile);

// Delete profile
router.delete("/delete-profile", verifyUserJWT, deleteProfile);

export default router;
