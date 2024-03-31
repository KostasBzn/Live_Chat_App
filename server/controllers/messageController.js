import Message from "../models/messageSchema.js";

//create a message
export const createMessage = async (req, res) => {
  const { chat, sender, text } = req.body;
  try {
    const newMessage = new Message({
      chat,
      sender,
      text,
    });

    await newMessage.save();

    await newMessage.populate("sender");

    res.status(200).send({ success: true, newMessage });
  } catch (error) {
    console.log("Error creating new message:", error.message);
    res.status(500).send({ success: false, error: error.message });
  }
};

//get messages
export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const allMessages = await Message.find({ chat: chatId })
      .populate("sender")
      .populate("chat");

    res.status(200).send({ success: true, allMessages });
  } catch (error) {
    console.log("Error getting the messages:", error.message);
    res.status(500).send({ success: false, error: error.message });
  }
};
