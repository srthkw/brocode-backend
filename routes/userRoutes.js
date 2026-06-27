import express from "express";
import protect from "../middleware/authMiddleware.js";
import { registerUser, checkUsername, loginUser, getUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/getusers",protect, getUsers);
router.post("/register", registerUser);
router.get("/check-username/:username", checkUsername);
router.post("/login", loginUser);
router.get("/profile",protect,(req, res) => {res.json(req.user);});


export default router;