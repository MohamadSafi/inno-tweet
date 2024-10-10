const express = require("express");
const axios = require("axios");
const { Pool } = require("pg");
const app = express();
const port = 3003;

app.use(express.json());

// Connecting to the postgress DB
const pool = new Pool({
  host: "postgres",
  user: "postgres",
  password: "password",
  database: "shared_db",
  port: 5432,
});

// Endpoint to Like a Message
app.post("/like", async (req, res) => {
  const { username, messageId } = req.body;

  if (!username || !messageId) {
    return res
      .status(400)
      .send({ error: "The username and message Id are required" });
  }

  // Checking if the user is registered
  try {
    const response = await axios.get(
      `http://user-service:3001/isRegistered/${username}`
    );
    if (!response.data.isRegistered) {
      return res.status(403).send({ error: "THe user is not registered" });
    }
  } catch (error) {
    return res.status(500).send({ error: "The user Service is unavailable" });
  }

  // Checking if user has already liked the message
  try {
    const result = await pool.query(
      "SELECT * FROM likes WHERE username = $1 AND messageid = $2",
      [username, messageId]
    );
    if (result.rows.length > 0) {
      return res
        .status(400)
        .send({ error: "This Message has been already liked by this user" });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Add the like event to the databse
      await client.query(
        "INSERT INTO likes (username, messageid) VALUES ($1, $2)",
        [username, messageId]
      );

      // Increment the like count in the messages table
      const updateResult = await client.query(
        "UPDATE messages SET likes = likes + 1 WHERE id = $1",
        [messageId]
      );
      if (updateResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).send({ error: "Message not found" });
      }

      await client.query("COMMIT");
      res.send({ message: "The Message was liked successfully" });
    } catch (error) {
      await client.query("ROLLBACK");
      res.status(500).send({ error: "A Server Error Accord" });
    } finally {
      client.release();
    }
  } catch (err) {
    res.status(500).send({ error: "A Server Error Accord" });
  }
});

app.listen(port, () => {
  console.log(`Like Service running on port ${port}`);
});
