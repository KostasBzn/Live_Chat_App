import Chat from "../models/chatSchema.js";

// Create new Chat
export const createNewChat = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "Sender ID and receiver ID are required.",
      });
    }

    const chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (chat) return res.status(200).json({ success: true, chat });

    const newChat = new Chat({
      participants: [senderId, receiverId],
    });

    await newChat.save();

    await newChat.populate("participants");

    res.status(200).json({ success: true, chat: newChat });
  } catch (error) {
    console.error("Error creating new Chat:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user chats
export const getUserChats = async (req, res) => {
  const { userId } = req.params;

  try {
    const userChats = await Chat.find({
      participants: { $in: [userId] },
    }).populate("participants");

    res.status(200).json({ success: true, userChats });
  } catch (error) {
    console.error("Error finding the chats for this user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

//find chat
export const findChat = async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    const chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("participants");

    res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error("Error finding the chat:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
