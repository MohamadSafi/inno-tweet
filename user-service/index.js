const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 3001;

app.use(express.json());

// Creating the Datbase
const sql_db = new sqlite3.Database("./database.sqlite", (error) => {
  if (error)
    console.error("Error Accured during creating the Database: ", error);
});

// Creating a Users Table
sql_db.run(`CREATE TABLE IF NOT EXISTS users (
  username TEXT PRIMARY KEY
)`);

// Endpoint to register a new user
app.post("/register", (req, res) => {
  const { username } = req.body;

  if (!username)
    return res.status(400).send({ error: "The username field is required!" });

  sql_db.run(`INSERT INTO users(username) VALUES(?)`, [username], (err) => {
    if (err) {
      if (err.code === "SQLITE_CONSTRAINT") {
        return res
          .status(400)
          .send({ error: "This username has been taken, Try another one!" });
      }
      return res.status(500).send({ error: "Server error Acord" });
    }
    res
      .status(200)
      .send({ message: "The user has beed registered successfully!" });
  });
});

// Endpoint to check if the user has already been registered
app.get("/isRegistered/:username", (req, res) => {
  const { username } = req.params;
  sql_db.get(
    `SELECT username FROM users WHERE username = ?`,
    [username],
    (err, row) => {
      if (err) return res.status(500).send({ error: "Server error Accord" });
      res.send({ isRegistered: !!row });
    }
  );
});

app.listen(port, () => {
  console.log(`The User Service is running on the port ${port}`);
});
