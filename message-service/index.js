const express = require("express");
const axios = require("axios");
const { Pool } = require("pg");
const app = express();
const port = 3002;

app.use(express.json());

// Connecting to the database
const pool = new Pool({
  host: "postgres",
  user: "postgres",
  password: "password",
  database: "shared_db",
  port: 5432,
});

// Endpoint used to post new message
app.post("/post", async (req, res) => {
  const { username, content } = req.body;

  if (!username || !content) {
    return res
      .status(400)
      .send({ error: "The username and content are both required" });
  }
  if (content.length > 400) {
    return res.status(400).send({
      error: "The Content of the msg ahould not exceed 400 characters",
    });
  }
  // Checking if user is registered using user service
  try {
    const response = await axios.get(
      `http://user-service:3001/isRegistered/${username}`
    );
    if (!response.data.isRegistered) {
      return res.status(403).send({ error: "The user is not registered" });
    }
  } catch (error) {
    return res.status(500).send({ error: "The user Service is unavailable" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO messages (username, content) VALUES ($1, $2) RETURNING id",
      [username, content]
    );
    res.status(201).send({
      message: "The Message posted successfully",
      id: result.rows[0].id,
    });
  } catch (err) {
    res.status(500).send({ error: "Server error accord" });
  }
});

// Endpoint to get the last 10 messages from the db
app.get("/feed", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM messages ORDER BY timestamp DESC LIMIT 10"
    );
    res.send(result.rows);
  } catch (err) {
    res.status(500).send({ error: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`The Message Service is running on port ${port}`);
});
