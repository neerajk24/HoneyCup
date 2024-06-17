// src/api/routes/notification.route.js
import express from "express";
import User from "../../models/user.model.js"; // Ensure the correct path to your user model

const router = express.Router();

router.post("/save-fcm-token", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send("Token is required");
  }

  try {
    const user = await User.findOneAndUpdate(
      { email: req.user.email }, // Update to your user identification logic
      { fcmToken: token },
      { new: true, upsert: true }
    );

    res.send("Token saved successfully");
  } catch (error) {
    console.error("Error saving FCM token:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
