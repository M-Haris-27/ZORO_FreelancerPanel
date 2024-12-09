// import { User } from "../Models/user.model.js";
// import { ErrorHandler } from "../Utils/ApiErrorHandler.js";
// import { AsyncHandler } from "../Utils/AsyncHandler.js";
// import jwt from "jsonwebtoken";

// export const verifyUserJWT = AsyncHandler(async (req, res, next) => {

//     try {
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
//         if (!token) {
//             throw new ErrorHandler(401, "Unauthorized Request");
//         }
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//         if (!token) {
//             throw new ErrorHandler(401, "Cannot verify the token");
//         }

//         const user = await User.findById(decodedToken._id);

//         if (!user) {
//             throw new ErrorHandler(401, "Invalid access token");
//         }
//         req.user = user;
//         next();

//     } catch (error) {
//         throw new ErrorHandler(401, error?.message || "Invalid access token");
//     }

// });


import { User } from "../Models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyUserJWT = async (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized: No token provided"
            });
        }

        // Verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find user
        const user = await User.findById(decodedToken._id);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized: User not found"
            });
        }

        // Attach user to request
        req.user = user;
        next();

    } catch (error) {
        console.error("JWT Verification Error:", error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        return res.status(500).json({
            message: "Internal server error during authentication",
            error: error.message
        });
    }
};