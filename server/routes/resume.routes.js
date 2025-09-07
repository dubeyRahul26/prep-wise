import express from 'express' ;
import multer from 'multer';
import { analyzeResume } from '../controllers/resume.controllers.js';


const router = express.Router() ;

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("resume"), analyzeResume)

export default router ;