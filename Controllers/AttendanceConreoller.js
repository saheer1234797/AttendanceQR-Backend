import { Attendance } from "../Models/Attendance.model.js";
import { User } from "../Models/User.model.js";
import { QR } from "../Models/QR.model.js";

const AttendanceController = {
 
  async getAllAttendanceByTeacher(req, res) {
    try {
      const id = req.user.id; 

      const records = await Attendance.find({ teacher: id })
        .populate("student", "name email class") 
        .populate("teacher", "name email")       
        .sort({ scannedAt: -1 });             

      res.status(200).json({
        message: "Data fetched successfully",
        data: records
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },


  async getAttendanceStudent(req, res) {
    try {
      const id = req.user.id;

      const records = await Attendance.find({ student: id })
        .populate("teacher", "name email")
              .populate("student", "name email class rollNumber") 
        .sort({ scannedAt: -1 });


   
      res.status(200).json({
        message: "Attendance fetched successfully",
        data: records
      });
    

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },





 async history(request,response){
  try{
    const studentId=request.user.id;
    const history=await Attendance.find({ student: studentId })  .select("scannedAt status -_id")   // ⬅️ sahi fields
      .sort({ scannedAt: 1 })
      .lean();

console.log("Student ID from token:", studentId);
    response.status(200).json({message:"data get sucessfull ",totalDays:history.length,data:history});

  }catch(error){
    console.log(error);
    response.status(500).json({message:"Internal sever Error "});

  }
 }



};

export default AttendanceController;





