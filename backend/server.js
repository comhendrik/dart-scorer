const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Connection Pool
const pool = new Pool({
    user: "user", // Same as POSTGRES_USER in Docker
    host: process.env.DATABASE_HOST, // Host of PostgreSQL Docker container / name of docker container
    database: "mydatabase", // Same as POSTGRES_DB in Docker
    password: "password", // Same as POSTGRES_PASSWORD in Docker
    port: 5432, // Default PostgreSQL port
});

// Routes
app.get("/leaderboard", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM leaderboard ORDER BY score DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data");
    }
});

app.get("/games", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM games WHERE user_id = $1", [req.query.user_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data");
    }
});

app.post("/items", async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *",
            [name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding item");
    }
});

app.delete("/items/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM items WHERE id = $1", [id]);
        res.send("Item deleted");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting item");
    }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
});
