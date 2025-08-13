import express from "express";
import { sendContactMessage } from "../Controllers/contactMessage.js";

const router = express.Router();

router.post("/email", sendContactMessage);

export default router;
