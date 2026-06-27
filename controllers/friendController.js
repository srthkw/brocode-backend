import FriendRequest from "../models/FriendRequest.js";

export const sendFriendRequest =
  async (req, res) => {
    try {

      const sender =
        req.user._id;

      const { receiverId } =
        req.body;

      if (
        sender.toString() ===
        receiverId
      ) {
        return res
          .status(400)
          .json({
            message:
              "You cannot send request to yourself",
          });
      }

      const existingRequest =
        await FriendRequest.findOne({
          sender,
          receiver: receiverId,
        });

      if (existingRequest) {
        return res
          .status(400)
          .json({
            message:
              "Request already sent",
          });
      }

      const request =
        await FriendRequest.create({
          sender,
          receiver: receiverId,
        });

      res.status(201).json(
        request
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };


export const getFriendRequests =
  async (req, res) => {

    try {

      const requests =
        await FriendRequest.find({
          receiver: req.user._id,
          status: "pending",
        })
        .populate(
          "sender",
          "username"
        );

      res.status(200).json(
        requests
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };
  

  export const acceptFriendRequest =
  async (req, res) => {

    try {

      const { requestId } =
        req.body;

      const request =
        await FriendRequest.findById(
          requestId
        );

      if (!request) {
        return res.status(404).json({
          message:
            "Request not found",
        });
      }

      if (
        request.receiver.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          message:
            "Not authorized",
        });
      }

      request.status =
        "accepted";

      await request.save();

      res.status(200).json({
        message:
          "Friend request accepted",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

export const getFriends =
  async (req, res) => {

    try {

      const requests =
        await FriendRequest.find({
          status: "accepted",
          $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
          ]
        })
        .populate(
          "sender receiver",
          "username"
        );

      const friends =
        requests.map((request) => {

          if (
            request.sender._id.toString() ===
            req.user._id.toString()
          ) {
            return request.receiver;
          }

          return request.sender;
        });

      res.status(200).json(
        friends
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };