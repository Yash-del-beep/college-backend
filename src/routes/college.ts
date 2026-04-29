import express from "express";
import { pool } from "../db";

const router = express.Router();

// ✅ GET ALL COLLEGES
router.get("/", async (req, res) => {
  try {
    const { search, location } = req.query;

    let query = "SELECT * FROM colleges WHERE 1=1";
    let values: any[] = [];

    if (search) {
      values.push(`%${search}%`);
      query += ` AND name ILIKE $${values.length}`;
    }

    if (location) {
      values.push(`%${location}%`);
      query += ` AND location ILIKE $${values.length}`;
    }

    const result = await pool.query(query, values);
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching colleges");
  }
});

// ✅ GET SINGLE COLLEGE
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const college = await pool.query(
      "SELECT * FROM colleges WHERE id=$1",
      [id]
    );

    const courses = await pool.query(
      "SELECT * FROM courses WHERE college_id=$1",
      [id]
    );

    res.json({
      ...college.rows[0],
      courses: courses.rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching college");
  }
});

// ✅ COMPARE COLLEGES
router.post("/compare", async (req, res) => {
  try {
    const { collegeIds } = req.body;

    const result = await pool.query(
      "SELECT * FROM colleges WHERE id = ANY($1)",
      [collegeIds]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error comparing colleges");
  }
});

// ✅ ALWAYS LAST
export default router;