
import { Attendance } from "../Models/Attendance.model.js";
import { User } from "../Models/User.model.js";

const adminControllerDashboard={
    async getAllteacehrAndStude(request,response){
        try{
            const totalStudents = await User.countDocuments({ role: "student" });
const totalTeachers = await User.countDocuments({ role: "teacher" });// total teacher count
return {totalStudents,totalTeachers};
//return  response.status(200).json({message:"data get sucesffull",data:{totalStudents,totalTeachers}})
    }catch(error){
            console.log(error);
            return response.status(500).json({error:"Internal server Error "});
            
        }
    }
    ,
    //chack today Attendece total 
   async todaysAttendance(request,response){
    try{
        const todayStart=new Date();
        todayStart.setHours(0,0,0,0);  //today time 12 PM
        const todayEnd=new Date();
        todayEnd.setHours(23,59,999);//today 11:59
        const todaysAttendance=await Attendance.countDocuments({scannedAt:{$gte:todayStart,$lte:todayEnd},})
        return {todaysAttendance};
        //return response.status(200).json({message:"today attendnce ",data:{todaysAttendance}})
    }catch(error){

        console.log(error);
        return response.status(500).json({message:"Internal server Error "});
        
    }
   }
,
async last7days(request, response) {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6); 
    last7Days.setHours(0, 0, 0, 0);

    const last7DaysAttendance = await Attendance.aggregate([
      {
        $match: {
          scannedAt: { $gte: last7Days, $lte: new Date() }, 
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$scannedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {last7DaysAttendance};
    // return response.status(200).json({
    //   message: "Get data for last 7 days",
    //   data: { last7DaysAttendance },
    // });

  } catch (error) {
    console.log(error);
    return response.status(500).json({
      error: "Internal Server Error",
    });
  }
},


async recentAttendance(request,response){
    try{

        const recentAttendance=await Attendance.find().sort({ scannedAt: -1 }).limit(5).populate("student", "name email").populate("teacher", "name");
       return {recentAttendance}
       // return response.status(200).json({message:"get data recent ",data:{recentAttendance}});

    }catch(error){
        console.log(error);
        return response.status(500).json({error:"Internals erver Error "});
    }
}

,

async deshbordAll(request,response){
    try{

const {totalStudents,totalTeachers}=await adminControllerDashboard.getAllteacehrAndStude();
const {totalAttendace}= await adminControllerDashboard.todaysAttendance();
const {last7days}=await adminControllerDashboard.last7days();
const {recentAttendance}=await adminControllerDashboard.recentAttendance();


return  response.status(200).json({message:"data  get sucessfull ",data:{totalStudents,totalTeachers,totalAttendace,last7days,recentAttendance}});
    
    }catch(error){
        console.log(error);
        return response.status(500).json({message:"Internal server Errro"});
        

    }
}



}


// // Controller
// // import { Attendance } from "../Models/Attendance.model.js";
// // import { User } from "../Models/User.model.js";


//   async deshbordAll(req, res) {
//     try {
//       const teacherId = req.user.id;

//       // Total counts
//       const totalStudents = await User.countDocuments({ role: "student" });
//       const totalTeachers = await User.countDocuments({ role: "teacher" });
//       const totalAttendance = await Attendance.countDocuments({ teacher: teacherId });

//       // Last 7 days count
//       const last7days = await Attendance.aggregate([
//         { $match: { teacher: teacherId } },
//         {
//           $group: {
//             _id: { $dateToString: { format: "%Y-%m-%d", date: "$scannedAt" } },
//             count: { $sum: 1 },
//           },
//         },
//         { $sort: { _id: -1 } },
//         { $limit: 7 },
//       ]);

//       // Recent attendance list
//       const recentAttendance = await Attendance.find({ teacher: teacherId })
//         .populate("student", "name email class")
//         .sort({ scannedAt: -1 })
//         .limit(10);

//       res.status(200).json({
//         data: {
//           totalStudents,
//           totalTeachers,
//           totalAttendance,
//           last7days,
//           recentAttendance,
//         },
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },



export default adminControllerDashboard;






///new 

// import { User } from "../models/User.model.js";
// import { Attendance } from "../models/Attendance.model.js";

export const getAllStudentsWithAttendance = async (req, res) => {
  try {
    // Get all students
    const students = await User.find({ role: "student" })
      .select("name email class");

    // Get attendance records
    const attendanceRecords = await Attendance.find({})
      .populate("student", "email");

    // Merge student data with attendance
    const finalData = students.map((student) => {
      const record = attendanceRecords.find(
        (att) => att.student?.email === student.email
      );

      return {
        name: student.name,
        email: student.email,
        class: student.class || "N/A",
        date: record ? new Date(record.scannedAt).toLocaleDateString() : "N/A",
        record: record ? record.status : "absent", // default absent if no record
      };
    });

    res.status(200).json({ data: finalData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};






// import { Attendance } from "../Models/Attendance.model.js";
// import { User } from "../Models/User.model.js";


// const adminControllerDashboard = {
//   // ✅ Get total students and teachers
//   async getAllTeacherAndStudent() {
//     const totalStudents = await User.countDocuments({ role: "student" });
//     const totalTeachers = await User.countDocuments({ role: "teacher" });
//     return { totalStudents, totalTeachers };
//   },

//   // ✅ Today attendance count
//   async todaysAttendance() {
//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);

//     const todayEnd = new Date();
//     todayEnd.setHours(23, 59, 59, 999);

//     const totalAttendance = await Attendance.countDocuments({
//       scannedAt: { $gte: todayStart, $lte: todayEnd },
//     });

//     return { totalAttendance };
//   },

//   // ✅ Last 7 days attendance
//   async last7days() {
//     const last7Days = new Date();
//     last7Days.setDate(last7Days.getDate() - 6);
//     last7Days.setHours(0, 0, 0, 0);

//     const last7DaysAttendance = await Attendance.aggregate([
//       {
//         $match: {
//           scannedAt: { $gte: last7Days, $lte: new Date() },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: "%Y-%m-%d", date: "$scannedAt" },
//           },
//           count: { $sum: 1 },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     return { last7DaysAttendance };
//   },

//   // ✅ Recent attendance list
//   async recentAttendance() {
//     const recentAttendance = await Attendance.find()
//       .sort({ scannedAt: -1 })
//       .limit(5)
//       .populate("student", "name email class")
//       .populate("teacher", "name");

//     // हमेशा array return करना
//     return { recentAttendance: Array.isArray(recentAttendance) ? recentAttendance : [] };
//   },

//   // ✅ Main Dashboard API
//   async deshbordAll(req, res) {
//     try {
//       const { totalStudents, totalTeachers } = await this.getAllTeacherAndStudent();
//       const { totalAttendance } = await this.todaysAttendance();
//       const { last7DaysAttendance } = await this.last7days();
//       const { recentAttendance } = await this.recentAttendance();

//       res.status(200).json({
//         message: "Dashboard data fetched successfully",
//         data: {
//           totalStudents,
//           totalTeachers,
//           totalAttendance,
//           last7days: last7DaysAttendance,
//           recentAttendance,
//         },
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },
// };

// export default adminControllerDashboard;




// import Attendance from "../Models/Attendance.model.js";
// import Student from "../Models/Student.model.js";

// export const recentAttendance = async (req, res) => {
//   try {
//     let query = Attendance.find()
//       .sort({ scannedAt: -1 })
//       .limit(5)
//       .populate("student", "name email");

//     // अगर teacher field schema में है तभी populate करो
//     if (Attendance.schema.path("teacher")) {
//       query = query.populate("teacher", "name");
//     }

//     const recentAttendance = await query.exec();

//     return res.json({
//       success: true,
//       data: recentAttendance || [],
//     });
//   } catch (error) {
//     console.error("Error in recentAttendance:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// export const getAllStudentsWithAttendance = async (req, res) => {
//   try {
//     const students = await Student.find().lean();
//     const attendanceRecords = await Attendance.find()
//       .populate("student", "name email")
//       .lean();

//     const finalData = students.map((student) => {
//       const record = attendanceRecords.find(
//         (att) => att.student?.email === student.email
//       );

//       return {
//         name: student.name,
//         email: student.email,
//         class: student.class || "N/A",
//         date: record?.scannedAt
//           ? new Date(record.scannedAt).toLocaleDateString()
//           : "N/A",
//         record: record?.status || "absent", // default absent
//       };
//     });

//     return res.json({
//       success: true,
//       data: finalData,
//     });
//   } catch (error) {
//     console.error("Error in getAllStudentsWithAttendance:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// export const deshbordAll = async (req, res) => {
//   try {
//     const recent = await Attendance.find()
//       .sort({ scannedAt: -1 })
//       .limit(10)
//       .populate("student", "name email")
//       .lean();

//     return res.json({
//       success: true,
//       recent: recent || [],
//     });
//   } catch (error) {
//     console.error("Error in deshbordAll:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };










// import { Attendance } from "../Models/Attendance.model.js";
// import { User } from "../Models/User.model.js";

// const adminControllerDashboard = {
//   async getAllTeacherAndStudent() {
//     const totalStudents = await User.countDocuments({ role: "student" });
//     const totalTeachers = await User.countDocuments({ role: "teacher" });
//     return { totalStudents, totalTeachers };
//   },

//   async todaysAttendance() {
//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);
//     const todayEnd = new Date();
//     todayEnd.setHours(23, 59, 59, 999);

//     const totalAttendance = await Attendance.countDocuments({
//       scannedAt: { $gte: todayStart, $lte: todayEnd },
//     });

//     return { totalAttendance };
//   },

//   async last7days() {
//     const last7Days = new Date();
//     last7Days.setDate(last7Days.getDate() - 6);
//     last7Days.setHours(0, 0, 0, 0);

//     const last7DaysAttendance = await Attendance.aggregate([
//       {
//         $match: {
//           scannedAt: { $gte: last7Days, $lte: new Date() },
//         },
//       },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$scannedAt" } },
//           count: { $sum: 1 },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     return { last7DaysAttendance };
//   },

//   async recentAttendance() {
//     const recentAttendance = await Attendance.find()
//       .sort({ scannedAt: -1 })
//       .limit(5)
//       .populate("student", "name email class")
//       .populate("teacher", "name");

//     return { recentAttendance: recentAttendance || [] };
//   },

//   async deshbordAll(req, res) {
//     try {
//       const { totalStudents, totalTeachers } = await adminControllerDashboard.getAllTeacherAndStudent();
//       const { totalAttendance } = await adminControllerDashboard.todaysAttendance();
//       const { last7DaysAttendance } = await adminControllerDashboard.last7days();
//       const { recentAttendance } = await adminControllerDashboard.recentAttendance();

//       res.status(200).json({
//         message: "Dashboard data fetched successfully",
//         data: {
//           totalStudents,
//           totalTeachers,
//           totalAttendance,
//           last7days: last7DaysAttendance,
//           recentAttendance,
//         },
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },
// };

// export default adminControllerDashboard;
