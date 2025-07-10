import express from "express";
import { generateQuestions } from "../controllers/generate.controller.js";

const router = express.Router();

router.post("/", generateQuestions);

export default router;
