import express from 'express';
import userController from '../Controllers/User.controller.js';
import Admin from '../Middleware/checkAdmin.js';
import auth1 from '../Middleware/auth1.js';
const router=express.Router();

router.post("/register",auth1,Admin.checkAdmin,userController.register);
router.post("/login",userController.login);
router.post("/logout",userController.logout);
router.get("/profile",auth1,userController.profile);



export default router;
