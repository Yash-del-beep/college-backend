"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const router = express_1.default.Router();
// ✅ GET ALL COLLEGES
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, location } = req.query;
        let query = "SELECT * FROM colleges WHERE 1=1";
        let values = [];
        if (search) {
            values.push(`%${search}%`);
            query += ` AND name ILIKE $${values.length}`;
        }
        if (location) {
            values.push(`%${location}%`);
            query += ` AND location ILIKE $${values.length}`;
        }
        const result = yield db_1.pool.query(query, values);
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error fetching colleges");
    }
}));
// ✅ GET SINGLE COLLEGE
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const college = yield db_1.pool.query("SELECT * FROM colleges WHERE id=$1", [id]);
        const courses = yield db_1.pool.query("SELECT * FROM courses WHERE college_id=$1", [id]);
        res.json(Object.assign(Object.assign({}, college.rows[0]), { courses: courses.rows }));
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error fetching college");
    }
}));
// ✅ COMPARE COLLEGES
router.post("/compare", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collegeIds } = req.body;
        const result = yield db_1.pool.query("SELECT * FROM colleges WHERE id = ANY($1)", [collegeIds]);
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error comparing colleges");
    }
}));
// ✅ ALWAYS LAST
exports.default = router;
