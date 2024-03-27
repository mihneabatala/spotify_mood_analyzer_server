import express from "express";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const router = express.Router();

const authorization =
  "Basic " +
  new Buffer.from(
    process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
  ).toString("base64");

router.post("/login", async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      res.status(404).json({ message: "Did not receive code, try again!" });
    }

    const postBody = {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "http://localhost:5173/",
    };

    const tokenInfo = await axios.post(
      "https://accounts.spotify.com/api/token", 
      postBody,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: authorization,
        },
      }
    );
    res.status(200).json(tokenInfo.data);
  } catch (err) {
    next(err);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res
        .status(404)
        .json({ message: "Did not receive refresh token, try again!" });
    }
    const postBody = {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    };
    const refreshInfo = await axios.post(
      "https://accounts.spotify.com/api/token",
      postBody,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: authorization,
        },
      }
    );
    res.status(200).json(refreshInfo.data);
  } catch (err) {
    next(err);
  }
});

export default router;
