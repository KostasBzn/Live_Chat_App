import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Register user
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const saltRounds = 10;

    const hashedpassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      username,
      email,
      password: hashedpassword,
    });
    await newUser.save();

    res.send({ success: true });
  } catch (error) {
    console.error("Error creating the user");
    res.status(500).json({ success: false, error: error.message });
  }
};
//Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched || !user)
      return res.status(400).send({
        success: false,
        error: "Email or password is wrong",
      });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECTER_KEY, {
      expiresIn: "1d",
    });
    res.status(200).send({ success: true, token, user });
  } catch (error) {
    console.log("Error sign in:", error.message);
    res.status(500).send({ success: false, error: error.message });
  }
};

//logged user
export const loggedUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({ _id: userId });
    res.status(200).send({ success: true, user });
  } catch (error) {
    console.log("Error logged user:", error.message);
    res.status(500).send({ success: false, error: error.message });
  }
};

//find a user
export const findUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res
        .status(500)
        .send({ success: false, message: "User not found" });
    }

    res.status(200).send({ success: true, user });
  } catch (error) {
    console.error("Error finding the user", error.message);
    res.status(500).send({ success: false, error: error.message });
  }
};

//find by username
export const findByUsername = async (req, res) => {
  const username = req.params.username;
  try {
    const users = await User.find({
      username: { $regex: new RegExp(username, "i") },
    });

    res.status(200).send({ success: true, users });
  } catch (error) {
    console.error("Error finding users by username:", error.message);
    res.status(500).send({ success: false, error: error.message });
  }
};
