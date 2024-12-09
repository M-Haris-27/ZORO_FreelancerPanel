import { User } from "../Models/user.model.js";
import { ErrorHandler } from "../Utils/ApiErrorHandler.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiResponseHandler } from "../Utils/ApiResponseHandler.js";



// Get Logged-in User Profile
export const getUserProfile = AsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .select("-password -refreshToken");

    if (!user) {
        throw new ErrorHandler(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponseHandler(200, user, "User profile retrieved successfully")
    );
});

