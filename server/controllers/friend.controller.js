import { User } from "../models/user.model.js";
import { FriendRequest } from "../models/friendRequest.model.js";

export const sendFriendRequest = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user.id;

  try {
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const request = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const manageFriendRequest = async (req, res) => {
  const { requestId, action } = req.body;

  try {
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    request.status = action;
    await request.save();

    if (action === "accepted") {
      // Add the receiver to the sender's friend list and vice versa
      await User.findByIdAndUpdate(request.sender, {
        $push: { friends: request.receiver },
      });
      await User.findByIdAndUpdate(request.receiver, {
        $push: { friends: request.sender },
      });

      // Optionally, remove the friend request after accepting it
      await FriendRequest.findByIdAndDelete(requestId);

      // Fetch updated friends list for both sender and receiver
      const updatedReceiver = await User.findById(request.receiver).populate("friends", "name email");
      const updatedSender = await User.findById(request.sender).populate("friends", "name email");

      return res.status(200).json({
        message: "Friend request accepted",
        senderFriends: updatedSender.friends,
        receiverFriends: updatedReceiver.friends,
      });
    }

    res.status(200).json({ message: "Friend request status updated", request });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const getFriendsList = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("friends", "email name");
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRandomUsers = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select("friends");
    const friendsIds = user.friends.map(friend => friend.toString());

    // Check for pending friend requests
    const pendingRequests = await FriendRequest.find({
      sender: userId,
      status: "pending"
    }).select("receiver");

    const pendingRequestsIds = pendingRequests.map(request => request.receiver.toString());

    const users = await User.aggregate([
      { $match: { _id: { $ne: userId, $nin: [...friendsIds, ...pendingRequestsIds] } } },
      { $sample: { size: 10 } },
      { $project: { password: 0 } }
    ]);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchUsers = async (req, res) => {
  const { query } = req.query;

  try {
      const users = await User.find({
          $or: [
              { username: { $regex: query, $options: 'i' } },
              { email: { $regex: query, $options: 'i' } }
          ]
      }).select('email name');

      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


export const getFriendRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find pending friend requests where the user is either the sender or the receiver
    const friendRequests = await FriendRequest.find({
      $or: [{ receiver: userId }],
      status: "pending",
    }).populate("sender receiver", "email name");

    if (!friendRequests.length) {
      return res.status(404).json({ message: "No pending friend requests" });
    }

    res.status(200).json(friendRequests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


