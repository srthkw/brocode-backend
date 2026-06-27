import DMMessage from "../models/DMMessage.js";

export const getDMHistory =
  async (req, res) => {

    try {

      const myId =
        req.user._id;

      const friendId =
        req.params.friendId;

      const messages =
        await DMMessage.find({
          $or: [
            {
              sender: myId,
              receiver: friendId,
            },
            {
              sender: friendId,
              receiver: myId,
            },
          ],
        }).sort({
          createdAt: 1,
        });

      res.status(200).json(
        messages
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

export const sendDM = async (req, res) => {
    try {
  
      const sender = req.user._id;
  
      const { receiver, message } = req.body;
  
      const dm = await DMMessage.create({
        sender,
        receiver,
        message,
      });
  
      res.status(201).json(dm);
  
    } catch (error) {
  
      res.status(500).json({
        message: error.message,
      });
  
    }
  };
