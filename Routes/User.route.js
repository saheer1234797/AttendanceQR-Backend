import express from 'express';
import userController from '../Controllers/User.controller.js';
import Admin from '../Middleware/checkAdmin.js';
import auth1 from '../Middleware/auth1.js';
const router=express.Router();

router.post("/register",auth1,Admin.checkAdmin,userController.register);// sucessfull test complete
router.post("/login",userController.login);//  sucessfull test complete 
router.post("/logout",userController.logout);
router.get("/profile",auth1,userController.profile);



export default router;
