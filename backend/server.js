const express = require("express");
const multer = require('multer');
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const jwt = require("jsonwebtoken");


const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const SECRET_KEY = "KEY HERE RAHH";

// Initialize database
const db = new sqlite3.Database("./database.db", err => {
  if (err) console.error("SQLite Connection Failed:", err);
  else console.log("Connected to SQLite");
});

// Create a sample table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`, (err) => {
  if (err) console.error("Error creating users table:", err.message);
});

db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_path TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`, (err) => {
  if (err) console.error("Error creating items table:", err.message);
});

db.run(`
  CREATE TABLE IF NOT EXISTS hearts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    book_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(book_id) REFERENCES items(id)
  )
`, (err) => {
  if (err) console.error("Error creating hearts table:", err.message);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// API Routes
app.get("/", (req, res) => res.send("Backend is running!"));

//get data from token
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "Welcome to the protected route!", user: req.user });
});

function verifyToken(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <TOKEN>"

  if (!token) return res.status(401).json({ error: "Malformed token" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Use your actual secret key
    req.user = decoded; // Attach user data
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}



app.get("/api/users", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
});

//login no encryption for simplicity
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email, password);

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(400).json({ error: "User not found" });

      const isMatch = password === user.password;
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET_KEY, { expiresIn: "1d" });

      res.json({ message: "Login successful", token });
  });
});

 //signup 
app.post("/api/signup", (req, res) => {
    const { name, email, password } = req.body;
    db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, name });
    });
});

// API endpoint to upload an image
app.post('/api/upload', upload.single('image'), (req, res) => {
  const { user_id, title, content } = req.body;
  const imagePath = `/uploads/${req.file.filename}`;

  db.run(
      `INSERT INTO items (user_id, title, content, image_path) VALUES (?, ?, ?, ?)`,
      [user_id, title, content, imagePath],
      function (err) {
          if (err) {
              return res.status(500).json({ error: err.message });
          }
          res.json({ id: this.lastID, title, content, imagePath });
      }
  );
});

// API endpoint to get uploaded items
app.get('/api/items', (req, res) => {
  db.all(`SELECT * FROM items`, [], (err, rows) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(rows);
  });
});

// API endpoint to delete an item
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM items WHERE id =?`, [id], (err) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Item deleted successfully" });
  });
});

//get specific book
app.get("/api/book/:id", (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM items WHERE id = ?`, [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Book not found" });

      res.json(row);
  });
});


//API search item 
app.get("/api/search/:search_key", (req, res) => {
  const { search_key } = req.params;

  db.all(`SELECT * FROM items WHERE title LIKE ?`, [`%${search_key}%`], (err, rows) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(rows); // Send the books list
  });
});

//api get hearts
app.get("/api/hearts/:user_id", (req, res) => {
  const { user_id } = req.params;

  db.all(
      `SELECT items.* FROM hearts 
       JOIN items ON hearts.book_id = items.id 
       WHERE hearts.user_id = ?`,
      [user_id],
      (err, rows) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json(rows); // Send back liked books
      }
  );
});



//API FOR HEARTS
app.post("/api/toggle-heart", (req, res) => {
  const { user_id, book_id } = req.body;

  if (!user_id || !book_id) {
      return res.status(400).json({ error: "Missing user_id or book_id" });
  }

  // Check if the heart already exists
  db.get(`SELECT * FROM hearts WHERE user_id = ? AND book_id = ?`, [user_id, book_id], (err, row) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }

      if (row) {
          // If heart exists, remove it (Unlike)
          db.run(`DELETE FROM hearts WHERE user_id = ? AND book_id = ?`, [user_id, book_id], (err) => {
              if (err) {
                  return res.status(500).json({ error: err.message });
              }
              res.json({ message: "Heart removed", liked: false });
          });
      } else {
          // If heart doesn't exist, add it (Like)
          db.run(`INSERT INTO hearts (user_id, book_id) VALUES (?, ?)`, [user_id, book_id], (err) => {
              if (err) {
                  return res.status(500).json({ error: err.message });
              }
              res.json({ message: "Heart added", liked: true });
          });
      }
  });
});



app.listen(5000, () => console.log("Server running on port 5000"));
