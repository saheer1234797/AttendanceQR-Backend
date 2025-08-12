import express from 'express';
import adminControllerDashboard from '../Controllers/admin.controller.js';
import { getAllStudentsWithAttendance } from '../Controllers/admin.controller.js';
import auth1 from '../Middleware/auth1.js';
const router =express.Router();
//router.get('/getStudentAndTeacher',auth1,adminControllerDashboard.getAllTeacherAndStudent);
router.get("/todaysAttendance",auth1,adminControllerDashboard.todaysAttendance);
router.get('/last7days',auth1,adminControllerDashboard.last7days);
 router.get('/recentAttendance',adminControllerDashboard.recentAttendance);
 router.get('/all',adminControllerDashboard.deshbordAll);

  router.get("/allData", getAllStudentsWithAttendance);
 
export default router;





