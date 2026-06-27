import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getDMHistory, sendDM } from "../controllers/dmController.js";

const router = express.Router();

router.get( "/:friendId", protect, getDMHistory );
router.post( "/", protect, sendDM );


export default router;