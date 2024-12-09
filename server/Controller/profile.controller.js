import { User } from "../Models/user.model.js";

// Create Profile
export const createProfile = async (req, res) => {
    try {
        const { bio, skills, portfolio, avatar } = req.body;

        // Check if the user already has a profile
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.profile.bio || user.profile.skills.length || user.profile.portfolio.length) {
            return res.status(400).json({ message: "Profile already exists. Use the update endpoint instead." });
        }

        // Create profile fields
        user.profile = {
            bio: bio || "",
            skills: skills || [],
            portfolio: portfolio || [],
            avatar: avatar || user.profile.avatar,
        };

        await user.save();

        res.status(201).json({ message: "Profile created successfully", profile: user.profile });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { bio, skills, portfolio, avatar } = req.body;

        // Check if the user exists
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate input (optional but recommended)
        if (skills && !Array.isArray(skills)) {
            return res.status(400).json({ message: "Skills must be an array" });
        }

        if (portfolio && !Array.isArray(portfolio)) {
            return res.status(400).json({ message: "Portfolio must be an array" });
        }

        // Update profile fields
        if (bio !== undefined) user.profile.bio = bio;
        if (skills !== undefined) user.profile.skills = skills;
        if (portfolio !== undefined) user.profile.portfolio = portfolio;
        if (avatar !== undefined) user.profile.avatar = avatar;

        // Save the updated user
        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            profile: user.profile
        });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({
            message: "An error occurred",
            error: error.message
        });
    }
};

// Clear Profile Section
export const deleteProfile = async (req, res) => {
    try {
        // Get user ID from JWT payload
        const userId = req.user.id;

        // Find the user by their ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Clear the profile section
        user.profile = {
            bio: null,
            skills: [],
            portfolio: [],
            avatar: "https://i.pinimg.com/originals/be/61/a4/be61a49e03cb65e9c26d86b15e63e12a.jpg", // Reset to default avatar
        };

        // Save the changes
        await user.save();

        res.status(200).json({ message: "Profile cleared successfully" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};


// Get Profile (Retrieve user profile details)
export const getProfile = async (req, res) => {
    try {
        // Ensure the user ID exists in the request
        if (!req.user || !req.user._id) {
            return res.status(400).json({ message: "User ID is missing from the request" });
        }

        // Fetch the user by their ID and select the profile data
        const user = await User.findById(req.user._id).select("profile");

        // If user not found, return a 404
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the profile details
        res.status(200).json({ profile: user.profile });
    } catch (error) {
        // If any other error occurs, return a 500
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};
