const express = require("express");
const { Pool } = require("pg");
const app = express();
const port = 3001;

app.use(express.json());

// Connecting to the database
const pool = new Pool({
  host: "postgres",
  user: "postgres",
  password: "password",
  database: "shared_db",
  port: 5432,
});

// Endpoint to Register a new user
app.post("/register", async (req, res) => {
  const { username } = req.body;

  if (!username)
    return res.status(400).send({ error: "The Username Field is required" });

  try {
    await pool.query("INSERT INTO users (username) VALUES ($1)", [username]);
    res
      .status(201)
      .send({ message: "The user has been registered successfully" });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).send({ error: "The username already exists" });
    }
    res.status(500).send({ error: "Database error" });
  }
});

// Endpoint to check if a user is registered
app.get("/isRegistered/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const result = await pool.query(
      "SELECT username FROM users WHERE username = $1",
      [username]
    );
    res.send({ isRegistered: result.rows.length > 0 });
  } catch (err) {
    res.status(500).send({ error: "Server Error" });
  }
});

app.listen(port, () => {
  console.log(`User Service running on port ${port}`);
});
