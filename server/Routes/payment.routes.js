import express from "express";
import { makePayment, viewPaymentHistory, releasePayment } from "../Controller/payment.controller.js";

const router = express.Router();

// POST: Make Payment
router.post("/make", makePayment);

// GET: View Payment History
router.get("/history/:userId", viewPaymentHistory);

// POST: Release Payment
router.post("/release", releasePayment);

export default router;
