import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./global/errorHandler.js";
import authorizationRouter from "./routes/authorizationRoute.js";
import discoverMoodRouter from "./routes/discoverMoodRoute.js";
import crestePlaylistRouter from "./routes/createPlaylistRoute.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(errorHandler);

app.use("/", authorizationRouter);
app.use("/", discoverMoodRouter);
app.use("/", crestePlaylistRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
