import express from "express";

import protect from "../middleware/authMiddleware.js";

import { sendFriendRequest, getFriendRequests, acceptFriendRequest, getFriends } from "../controllers/friendController.js";

const router = express.Router();

router.get( "/", protect, getFriends );
router.post( "/send-request", protect, sendFriendRequest );
router.get( "/requests", protect, getFriendRequests );
router.put( "/accept-request", protect, acceptFriendRequest );

export default router;