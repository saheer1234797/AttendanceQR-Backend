import express from 'express';
import AttendaceController from '../Controllers/AttendanceConreoller.js';
import auth1 from '../Middleware/auth1.js';
const router=express.Router();
router.get('/at',auth1,AttendaceController.getAllAttendanceByTeacher);
router.get('/st',auth1,AttendaceController.getAttendanceStudent); 
router.get("/history",auth1,AttendaceController.history);
export default router; 