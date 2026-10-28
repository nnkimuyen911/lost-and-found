import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import { PORT, dbConfig } from "./config.js";
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url); // to require require for multer
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/files", express.static("files"));

// ============================== MySQL pool ==============================
// Connects lazily — no server restart needed when the DB comes up later.
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
});

const query = async (sql, params = []) => {
  const [rows] = await pool.query(sql, params);
  return rows;
};

// mysql2 errors can have an empty .message — include .code / .sqlMessage too
const errText = (error) =>
  [error.code, error.sqlMessage || error.message].filter(Boolean).join(" - ") ||
  String(error);

// Columns returned by the API. `id` is aliased as `_id` so the React
// frontend keeps working exactly like it did with MongoDB.
const itemColumns =
  "id AS _id, name, email, phoneno, title, description, image, created_at, updated_at";

// Log DB connectivity on startup (same spirit as the old mongoose.connect)
(async () => {
  try {
    await query("SELECT 1");
    console.log("Connected to MySQL database");
  } catch (error) {
    console.error("MySQL connection failed:", errText(error));
  }
})();

// make sure the upload folder exists (multer needs it)
fs.mkdirSync("./files", { recursive: true });

// ============================== multer ==============================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

// ============================== get =================================

app.get("/item", async (req, res) => {
  try {
    const items = await query(`SELECT ${itemColumns} FROM items ORDER BY id ASC`);
    return res.status(200).json({
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).send({ message: errText(error) });
  }
});

// ===============================post===================================

app.post("/item", upload.single("file"), async (req, res) => {
  console.log(req.file);
  try {
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.phoneno ||
      !req.body.title ||
      !req.body.description
    ) {
      return res.status(400).send({ message: "all fields sent" });
    }

    // image is optional — no file uploaded means image = NULL
    const image = req.file ? req.file.filename : null;

    const result = await query(
      "INSERT INTO items (name, email, phoneno, title, description, image) VALUES (?, ?, ?, ?, ?, ?)",
      [
        req.body.name,
        req.body.email,
        req.body.phoneno,
        req.body.title,
        req.body.description,
        image,
      ]
    );

    // return the created item (same as Mongo's Item.create() used to)
    const [item] = await query(`SELECT ${itemColumns} FROM items WHERE id = ?`, [
      result.insertId,
    ]);
    return res.status(200).send(item);
  } catch (error) {
    console.log(error);
    res.status(500).send("error");
  }
});

// ================================-get id ==============================

app.get("/item/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const rows = await query(`SELECT ${itemColumns} FROM items WHERE id = ?`, [id]);
    const item = rows[0] || null;
    return res.status(200).json(item);
  } catch (error) {
    res.status(500).send({ message: errText(error) });
  }
});

// =================================-delete =============================

app.delete("/item/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await query("DELETE FROM items WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Item not found" });
    }
    return res.status(200).send({ message: "Item deleted" });
  } catch (error) {
    console.log(errText(error));
    return res.status(500).send({ message: errText(error) });
  }
});

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
