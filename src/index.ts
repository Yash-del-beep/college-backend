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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});