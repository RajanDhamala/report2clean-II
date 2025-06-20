import jwt from "jsonwebtoken";
import User from "../schema/User.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { CreateAccessToken, CreateRefreshToken } from "../utils/Tokens.js";
import dotenv from "dotenv"
dotenv.config()

const AuthUser = asyncHandler(async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  if (!accessToken && !refreshToken) {
    return res.status(400).json({ message: "Please add the cookies in request" });
  }
  try {
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (decodedToken) {
      req.user = decodedToken;
      return next();
    }
  } catch (err) {
    console.log("Access token expired or invalid:", err.message);
  }
  try {
    console.log("refresh token:", refreshToken);
    const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findOne({ email: decodedRefresh.email }).select(
      "fullname email _id refreshToken"
    );

    // if (!user || user.refreshToken !== refreshToken) {
    //   return res.status(401).json({ message: "Cookies expired or invalid" });
    // }

    const newAccessToken = CreateAccessToken(user);

    res.cookie('accessToken', newAccessToken, {
   httpOnly: true,
    maxAge: 10 * 60 * 1000,
  });
    res.send(json({message:"refrehsed the access token"}))
    req.user = user;
    return next();
  } catch (err) {
    console.log("Refresh token expired or invalid:", err.message);
    return res.status(401).json({ message: "Cookies expired or invalid" });
  }
});

export default AuthUser;
