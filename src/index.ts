import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { pool } from "./db";
import collegeRoutes from "./routes/college";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ ROUTES
app.use("/colleges", collegeRoutes);

// ✅ TEST
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM colleges");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("DB error");
  }
});

// ✅ START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});