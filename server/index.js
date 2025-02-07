require("dotenv").config();
const express = require("express");
const session = require("express-session");
const axios = require("axios");
const qs = require("qs");

const app = express();
const PORT = 3000;

const { CLIENT_ID, CLIENT_SECRET, SESSION_SECRET } = process.env;

app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true })
);

app.get("/auth", (req, res) => {
  const authUrl = `https://bitbucket.org/site/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code`;
  res.redirect(authUrl);
});

app.get("/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  try {
    const response = await axios.post(
      "https://bitbucket.org/site/oauth2/access_token",
      qs.stringify({
        grant_type: "authorization_code",
        code,
      }),
      {
        auth: { username: CLIENT_ID, password: CLIENT_SECRET },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    req.session.access_token = response.data.access_token;
    res.send("Authentication successful! You can now retrieve PR data.");
  } catch (error) {
    res.status(500).send("Error exchanging code for token.");
  }
});

app.get("/me", async (req, res) => {
  if (!req.session.access_token) {
    return res.status(401).send("User not authenticated");
  }

  try {
    const response = await axios.get("https://api.bitbucket.org/2.0/user", {
      headers: { Authorization: `Bearer ${req.session.access_token}` },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching pull requests.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
