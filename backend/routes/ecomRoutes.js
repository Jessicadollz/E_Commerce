import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  isUserLoggedIn,
  forgotPassword,
  verifyOtp,
  changePassword,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const ecomRouter = express.Router();

ecomRouter.post("/user/register", registerUser);
ecomRouter.post("/user/login", loginUser);
ecomRouter.post("/user/logout", logoutUser);
ecomRouter.get("/user/loggedIn", authMiddleware, isUserLoggedIn);
ecomRouter.post('/user/forgot-password', forgotPassword);
ecomRouter.post('/user/verify-otp', verifyOtp);
ecomRouter.post('/user/change-password', changePassword);

export default ecomRouter;