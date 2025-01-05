import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  getFriendsList,
  sendFriendRequest,
  manageFriendRequest,
  getRandomUsers,
  searchUsers,
  getFriendRequests
} from "../controllers/friend.controller.js";
import { getFriendRecommendations } from "../controllers/recommend.controller.js";

const router = Router();

router.post("/request", authenticate, sendFriendRequest);
router.post("/manage", authenticate, manageFriendRequest);
router.get("/all", authenticate, getFriendsList);
router.get("/recommend", authenticate, getFriendRecommendations);
router.get("/requests", authenticate, getFriendRequests);
router.get("/random", authenticate,  getRandomUsers);
router.get("/search",  searchUsers);

export default router;
