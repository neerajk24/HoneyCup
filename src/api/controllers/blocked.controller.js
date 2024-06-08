// src/api/controllers/blocked.controller.js

import User from "../../models/user.model.js";

// Controller to add a user to the blocked list
export const addBlockedUser = async (req, res) => {
  const { userId, blockedUserId } = req.body;

  try {
    // console.log(
    //   "Attempting to block. UserId:",
    //   userId,
    //   "BlockedUserId:",
    //   blockedUserId
    // );

    const user = await User.findById(userId);
    const blockedUser = await User.findById(blockedUserId);

    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ error: "User not found" });
    }
    if (!blockedUser) {
      console.log("Blocked user not found:", blockedUserId);
      return res.status(404).json({ error: "User to be blocked not found" });
    }

    if (user.blocked_users.includes(blockedUserId)) {
      console.log("User already blocked");
      return res.status(400).json({ message: "User is already blocked" });
    }

    user.blocked_users.push(blockedUserId);
    await user.save();

    console.log("User blocked successfully");
    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    console.error("Error in addBlockedUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to remove a user from the blocked list
export const removeBlockedUser = async (req, res) => {
  const { userId, blockedUserId } = req.body;
  try {
    const user = await User.findById(userId);
    const blockedUser = await User.findById(blockedUserId);

    if (!user || !blockedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    user.blocked_users = user.blocked_users.filter(
      (uid) => uid.toString() !== blockedUserId
    );
    await user.save(); // Correctly await the save method
    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    console.error("Error in removeBlockedUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to get the list of blocked users
export const getBlockedUsers = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate(
      "blocked_users",
      "username email"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const blockedUsers = user.blocked_users;
    res.status(200).json({ blockedUsers });
  } catch (error) {
    console.error("Error in getBlockedUsers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
