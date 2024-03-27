import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import OpenAI from "openai";
dotenv.config();

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/create_playlist", async (req, res, next) => {
  try {
    // Data
    const { spotifyToken, mood, userID, playlistCounter } = req.body;

    // Token verification
    if(!spotifyToken){
      res.status(404).json({ message: "Token not available." });
    }
    const authorization = `Bearer ${spotifyToken}`;

    // Request OpenAI to generate a list of tracks

    const responseTracks = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `Generate a list of 20 tracks,matching the user's mood. Include the most recent released tracks from this countries: United Kingdom, Brazil, Spain, France, United States, Turkey, Canada, Germany. Ensure diversity in artists and genres for an accurate representation of the mood. For each track, include the title and artist in JSON. `,
        },
        {
          role: "user",
          content: mood,
        },
      ],
    });

    // Transfrom the JSON from OpenAI to an array of objects, transform array to unique tracks and after that shuffle the array

    const playlistTracks = JSON.parse(
      responseTracks.choices[0].message.content
    );

    const modifiedPlaylist = Object.values(playlistTracks);
    const tracksArray = modifiedPlaylist[0];

    const uniqueTracks = Object.values(
      tracksArray.reduce((acc, track) => {
        acc[track.title] = track;
        return acc;
      }, {})
    );

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    const shuffledArray = shuffleArray(uniqueTracks);

    // Create new Spotify Playlist

    let createdPlaylistID;

    if (shuffledArray.length > 10) {
      const createdPlaylist = await axios.post(
        `https://api.spotify.com/v1/users/${userID}/playlists`,
        {
          name: `${mood} Mood ${playlistCounter}🎧`,
          description: "Created from Mood Analyzer",
        },
        {
          headers: {
            Authorization: authorization,
          },
        }
      );
      createdPlaylistID = createdPlaylist.data.id;
    } else {
      throw new Error("Bad response from OpenAI");
    }

    // Search for tracks uri

    const uriArray = [];

    for (const track of shuffledArray) {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          track.title
        )}&artist=${encodeURIComponent(track.artist)}&type=track&limit=2`,
        {
          headers: {
            Authorization: authorization,
          },
        }
      );
      const songURI = response.data.tracks.items[0].uri;
      uriArray.push(songURI);
    }

    // Add tracks to the created playlist

    axios.post(
      `https://api.spotify.com/v1/playlists/${createdPlaylistID}/tracks`,
      {
        uris: uriArray,
        position: 0,
      },
      {
        headers: {
          Authorization: authorization,
        },
      }
    );
    res.status(200).json({ message: "Playlist created succesfully" });
  } catch (err) {
    next(err);
  }
});
export default router;
