const express = require("express");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 3002;

app.use(express.json());

// Creating the SQLite Database
const sql_db = new sqlite3.Database("./database.sqlite", (error) => {
  if (error) console.error("Database opening error: ", error);
});

// Creating a messages Table
sql_db.run(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Endpoint used to post new message
app.post("/post", async (req, res) => {
  const { username, content } = req.body;

  if (!username || !content) {
    return res
      .status(400)
      .send({ error: "The username and the content of the msg are required" });
  }
  // Checking if the message is more that 400 chars
  if (content.length > 400) {
    return res
      .status(400)
      .send({ error: "Content is too big, Maximum is 400 characters" });
  }

  // Checking if the user is registered
  try {
    const response = await axios.get(
      `http://user-service:3001/isRegistered/${username}`
    );
    if (!response.data.isRegistered) {
      return res.status(403).send({ error: "This username is not registered" });
    }
  } catch {
    return res.status(500).send({ error: "User Service is unavailable" });
  }

  // Adding the message to the database
  sql_db.run(
    `INSERT INTO messages (username, content) VALUES (?, ?)`,
    [username, content],
    function (err) {
      if (err) return res.status(500).send({ error: "Database error" });
      res.status(201).send({
        message: "The Message has been posted successfully",
        id: this.lastID,
      });
    }
  );
});

// Endpoint to get the last 10 messages from the db
app.get("/feed", (req, res) => {
  sql_db.all(
    `SELECT * FROM messages ORDER BY timestamp DESC LIMIT 10`,
    [],
    (err, rows) => {
      if (err) return res.status(500).send({ error: "Server Error" });
      res.send(rows);
    }
  );
});

// Increment the likes
app.post("/like/:id", (req, res) => {
  const { id } = req.params;
  sql_db.run(
    `UPDATE messages SET likes = likes + 1 WHERE id = ?`,
    [id],
    function (err) {
      if (err) return res.status(500).send({ error: "Server error" });
      if (this.changes === 0)
        return res.status(404).send({ error: "This Message does not exist" });
      res.send({ message: "Message liked successfully" });
    }
  );
});

app.listen(port, () => {
  console.log(`The Message Service is running on port ${port}`);
});
