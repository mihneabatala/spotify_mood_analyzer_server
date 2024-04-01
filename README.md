# Server for Spotify Mood Analyzer
## This Express server code is divided into three main routes: "/login", "/create_playlist", and "/mood".

The "/login" route handles user authentication with Spotify's API. It validates a code received from the client and exchanges it for an access token using the OAuth 2.0 authorization code flow.

The "/create_playlist" route generates a playlist based on a user's mood by utilizing the OpenAI API to generate a list of tracks. It then creates a new Spotify playlist and adds the generated tracks to it, ensuring diversity in artists and genres.

Lastly, the "/mood" route analyzes a user's listening history to determine their overall mood. It processes the provided track data, sends it to OpenAI for mood analysis, and responds with a single word representing the user's mood.

Throughout this project, I integrated multiple APIs including Spotify's and OpenAI's, utilized OAuth 2.0 for user authentication, and implemented error handling for various scenarios such as missing tokens or incorrect API responses. I also learned about data transformation techniques, API request handling, and asynchronous programming in Node.js with Express. This project showcases the power of combining different APIs to create a personalized experience for users based on their listening preferences.
