import express from "express";
import multer from "multer";

import {bulkUploadStudents} from "../Controllers/Bulk.controller.js"

const router = express.Router();

// Multer config memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post("/upload", upload.single("file"), bulkUploadStudents);

export default router;
