import express from "express";
import { verifyUserJWT } from "../Middlewares/auth.middleware.js";
import { getUserProfile } from "../Controller/user.controller.js";


const router = express.Router();

//User routes:
router.get("/me", verifyUserJWT, getUserProfile);


export default router;