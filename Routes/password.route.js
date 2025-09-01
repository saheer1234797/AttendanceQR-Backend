import { forgotPassword } from "../Controllers/Forgotpassword.controller.js";
import { resetPassword } from "../Controllers/resetpassword.controller.js";
import express from 'express';
const router=express.Router();
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
export default router;