import { Attendance } from "../Models/Attendance.model.js";
import { User } from "../Models/User.model.js";
import { QR } from "../Models/QR.model.js";

// const AttendaceController={
//     async getAllAttendanceByTeacher(request,response){
//         try{
//             const {id}=request.user.id;
//             const records=await Attendance.find({teacher: id }).populate("student","name email").populate('qrId',"createdAt");
//             response.status(200).json({meassage :"data get sucessfull ",data:records});

//         }catch(error){
//             console.log(error);
//             response.status(500).json({message:"Internal server Error "});
            


//         }
//     }
//     ,

//     async getAttendenceStudent(request,response){
//         try{
//             const {id}=request.user.id;
//             const records=await Attendance.find({student:id}).populate("teacher","name email").populate("qrId","created");
//             response.status(200).json({massage:"attendence get sucessfull ",data:records});


//         }catch(error){
//             console.log(error);
//             response.status(500).json({message:"Internal server Error "});
             
//         }
//     }

// }
// export default  AttendaceController;


// import { Attendance } from "../Models/Attendance.model.js";

const AttendanceController = {
  // Teacher के लिए attendance list
  async getAllAttendanceByTeacher(req, res) {
    try {
      const id = req.user.id; // ✅ Correct destructuring

      const records = await Attendance.find({ teacher: id })
        .populate("student", "name email class") // ✅ student details
        .populate("teacher", "name email")       // Optional: teacher details
        .sort({ scannedAt: -1 });                // Latest first

      res.status(200).json({
        message: "Data fetched successfully",
        data: records
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Student के लिए attendance list
  async getAttendanceStudent(req, res) {
    try {
      const id = req.user.id;

      const records = await Attendance.find({ student: id })
        .populate("teacher", "name email") // ✅ teacher details
        .sort({ scannedAt: -1 });

      res.status(200).json({
        message: "Attendance fetched successfully",
        data: records
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export default AttendanceController;





