import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import OpenAI from "openai";
dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/mood", async (req, res, next) => {
  try {
    const { historyTracks } = req.body;

    const newHistoryTracks = historyTracks.map((track) => {
      return {
        artist: track.artist,
        title: track.title,
      };
    });
    const uniqueTracks = [];
    const uniqueTitles = new Set();

    newHistoryTracks.forEach((track) => {
      if (!uniqueTitles.has(track.title)) {
        uniqueTitles.add(track.title);
        uniqueTracks.push(track);
      }
    });
    const stringUniqueTracks = JSON.stringify(uniqueTracks);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature:0.6,
      messages: [
        {
          role: "system",
          content:
            "Analyze the provided tracks and artists to determine the listener's overall mood. Analyze each track, carefully determining its emotional essence. Very important, the response has to be in one word, representing the mood of the user.",
        },
        {
          role: "user",
          content: stringUniqueTracks,
        },
      ],
    });
    const mood = response.choices[0].message.content;
    if(mood.length > 50){
      res.status(404).json({message:"Wrong AI response"})
    }
    res.status(200).json({ mood: mood });
  } catch (err) {
    next(err);
  }
});

export default router;
