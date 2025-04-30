const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3001;


const JWT_SECRET = "your_secret_key"; // Replace with a real secret in production!

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Connection Pool
const pool = new Pool({
    user: "user", // Same as POSTGRES_USER in Docker
    host: process.env.DATABASE_HOST || "localhost", // Host of PostgreSQL Docker container / name of docker container
    database: "mydatabase", // Same as POSTGRES_DB in Docker
    password: "password", // Same as POSTGRES_PASSWORD in Docker
    port: 5432, // Default PostgreSQL port
});

//Authentication
// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.header("Authorization")?.split(" ")[1];  // Expecting "Bearer <token>"

    if (!token) {
        return res.status(403).json({ error: "Access denied, no token provided." });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Add user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

app.get("/users", authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users ORDER BY username DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data");
    }
});

app.get("/games", authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM games WHERE user_id = $1", [req.query.user_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data");
    }
});

app.post("/games", authenticateJWT, async (req, res) => {
    const { haswon, user_id } = req.body;

    if (!user_id || !haswon) {
        return res.status(400).send("Missing required fields");
    }

    try {
        const result = await pool.query(
            `INSERT INTO games (haswon, user_id)
             VALUES ($1, $2) RETURNING *`,
            [haswon, user_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating game");
    }
});



// Register
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
            [username, hashedPassword]
        );

        const user = result.rows[0];

        // Create JWT
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Return token and user data
        res.status(201).json({ token, id: user.id, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
});


// Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        const user = result.rows[0];
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, id: user.id, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
});


// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
});