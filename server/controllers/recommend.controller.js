import { User } from "../models/user.model.js";

export const getFriendRecommendations = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("friends");
    const friendsOfFriends = new Set();

    user.friends.forEach((friend) => {
      friend.friends.forEach((fof) => {
        if (fof.toString() !== userId && !user.friends.includes(fof)) {
          friendsOfFriends.add(fof.toString());
        }
      });
    });

    const recommendations = await User.find({
      _id: { $in: Array.from(friendsOfFriends) },
    }).select("email");
    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
