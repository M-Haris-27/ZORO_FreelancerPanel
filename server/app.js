import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Configure middleware
app.use(
    cors({
        origin: "http://localhost:5173", // Frontend URL during development
        credentials: true,
    })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Import routes
import authRouter from "./Routes/auth.routes.js";
import userRouter from "./Routes/user.routes.js";
import jobRouter from "./Routes/job.routes.js";
import profileRouter from "./Routes/profile.routes.js";
import earningsRouter from "./Routes/earnings.routes.js"; // Import earnings routes
import errorMiddleware from "./Middlewares/error.middleware.js";
import projectRouter from "./Routes/project.routes.js";
import paymentRouter from "./Routes/payment.routes.js"; // Import payment routes
import reviewRouter from "./Routes/review.routes.js"; // Import review routes

// Endpoints
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/profiles", profileRouter);
app.use("/api/v1/earnings", earningsRouter); // Add earnings endpoint
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/reviews", reviewRouter);

// app.all("*", (req, res) => {
//     console.log("Unhandled route:", req.method, req.originalUrl);
//     res.status(404).json({ message: "Route not found" });
// });


// Error handler middleware
app.use(errorMiddleware);

export default app;
