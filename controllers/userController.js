import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import User from "../models/User.js";

export const registerUser = async (
  req,
  res
) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
    } = req.body;

    const existingUser =
      await User.findOne({
        $or: [
          { email },
          { username },
        ],
      });

    if (existingUser) {
      return res.status(400).json({
        message:
          "Email or username already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message:
        "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const checkUsername = async (
    req,
    res
  ) => {
    try {
      const { username } = req.params;
  
      const user = await User.findOne({
        username,
      });
  
      res.status(200).json({
        available: !user,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  export const loginUser = async (
    req,
    res
  ) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({
        email,
      });
  
      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }
  
      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );
  
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }
  
      res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  export const getUsers = async (req, res) => {
    try {
  
      const users = await User.find(
        {
          _id: {
            $ne: req.user._id
          }
        }
      ).select("_id username");
  
      res.status(200).json(users);
  
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };