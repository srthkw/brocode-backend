import Message from "../models/Message.js";

export const getMessages = async (req, res) => {

  const { room } = req.params;

  try {
    const messages = await Message.find({ room })
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { username, message } = req.body;

    const newMessage = await Message.create({
      username,
      message,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};