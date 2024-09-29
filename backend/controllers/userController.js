import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../services/tokenGenerate.js";
import { sendMail } from "../services/sendMail.js";
import { generateSixDigitRandomNumber } from "../utils/otpGenerator.js";

export async function registerUser(req, res) {
  try {
    let { firstname, lastname, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    password = hashedPassword;
    const user = new userModel({ firstname, lastname, email, password, role });
    await user.save();
    res.status(201).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password, role } = req.body;

    const checkUser = await userModel.findOne({ email }).exec();

    console.log(email, password, role)
    console.log(checkUser)

    if (!checkUser) {
      res.status(404).json({ error: "Invalid Credentials" });
    }

    const check = await bcrypt.compare(password, checkUser.password);
console.log(check) //true
    if (!check) {
      return res.status(404).json({ error: "Invalid Credentials" });
    }

    if (checkUser.role === role) {
      //Create a token using JWT
      console.log(role);
      const token = generateToken(checkUser);

      // How to send token to frontend?
      //1. sending token in response body, saving it in localStorage in frontend
      //2. sending token as a server only cookie (http only cookie): securing it from XSS attacks(Cross site scripting attack)

      // // Option 1: Send token in response body
      // res.status(200).json({
      //   message: "Login successful",
      //   token,
      // });
console.log("token generated", token)
      res
        .cookie("auth_token", token, {
          httpOnly: true,
          secure: false, //as we are working with localhost, which runs on http, not on https
          sameSite: "strict",
          maxAge: 3600000,
        })
        .status(200)
        .json({
          message: "Login Successful",
        });
    }
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ error: err });
  }
}

export async function logoutUser(req, res) {
  try {
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

export function isUserLoggedIn(req, res) {
  // console.log(req);
  res.json({ user: req.user });
}

export const forgotPassword = async (req, res) => {
  console.log("Forgot password")
  const { email } = req.body;
  const user = await userModel.findOne({ email: email });
  console.log(user, email)
  if(!user) {
    return res.status(404).json({ message: 'User not found'});
  }
  const subject = 'Reset Password';
  const otp = generateSixDigitRandomNumber();
  const emailBody = `
    OTP - ${otp}, This OTP is valid for 5 minutes.
  `;
 // await sendMail(process.env.SENDER_EMAIL, process.env.SENDER_EMAIL_APP_PASSWORD, email, subject, otp);
 await sendMail(process.env.SENDER_EMAIL, process.env.SENDER_EMAIL_APP_PASSWORD, email, subject, emailBody);
  await updateOtp(user._id, otp)
  res.status(200).json({ message: "Forgot password..." });
  console.log("Forgot password completed")
}

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await userModel.findOne({ email: email });
  if(!user) {
    res.status(404).json({ message: "User not found" });
  }
 // if(user.otp == otp && Date.now() > user.otpExpiresAt) {
  if(user.otp == otp) {
    res.status(200).json({ message: 'OTP is verified successfully' });
  } else {
    res.status(401).json({ message: "Invalid OTP" });
  }
}

export const changePassword = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne( { email: email });
  if(!user) {
    res.status(404).json({ message: "User not found" });
  }
  console.log(password);
  const hashedPassword = await bcrypt.hash(password, 10);
  await userModel.findByIdAndUpdate(
    user._id,
    { password: hashedPassword },
    { new: true, upsert: false }
  );
  res.status(200).json({ message: 'Password updated successfully' });
}

async function updateOtp(userId, otp) {
  try {
    const validFor = Date.now() + 5 * 60 * 1000;
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { otp, otpExpiresAt: validFor},
      { new: true, upsert: false }
    );

    if(!updatedUser) {
      console.log("User not found");
      return null;
    }
  } catch(error) {
    console.error("Error updating OTP:", error);
    throw error;
  }
}