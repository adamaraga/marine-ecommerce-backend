const Message = require("../models/Message");

exports.addMessage = async (req, res) => {
  const newMessage = new Message({
    userId: req.body.userId,
    name: req.body.name,
    message: req.body.message,
    email: req.body.email,
  });

  try {
    await newMessage.save();

    res.status(201).json({ message: "Message Sent successfully!" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getMessages = async (req, res) => {
  const limit = 10;
  const page = req.params.page;

  try {
    const messages = await Message.paginate(
      {},
      {
        limit,
        page,
        sort: {
          _id: -1,
        },
      }
    );

    const { docs, totalPages } = messages;

    res.status(200).json({ messages: docs, totalPages, limit });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getMessage = async (req, res) => {
  try {
    const message = await Message.findById({ _id: req.params.id });

    res.status(200).json(message);
  } catch (err) {
    res.status(500).json(err);
  }
};
