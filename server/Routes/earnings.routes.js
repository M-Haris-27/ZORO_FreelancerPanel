import express from "express";
import { viewEarnings, withdrawFunds } from "../Controller/earning.controller.js";
import { verifyUserJWT } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.get("/view", verifyUserJWT, viewEarnings);

router.post("/withdraw", verifyUserJWT, withdrawFunds);

export default router;
