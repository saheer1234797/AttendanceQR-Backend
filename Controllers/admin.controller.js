
import { Attendance } from "../Models/Attendance.model.js";
import { User } from "../Models/User.model.js";

const adminControllerDashboard={
    async getAllteacehrAndStude(request,response){
        try{
            const totalStudents = await User.countDocuments({ role: "student" });
const totalTeachers = await User.countDocuments({ role: "teacher" });
return {totalStudents,totalTeachers};
    }catch(error){
            console.log(error);
            return response.status(500).json({error:"Internal server Error "});
            
        }
    }
    ,
    
   async todaysAttendance(request,response){
    try{
        const todayStart=new Date();
        todayStart.setHours(0,0,0,0); 
        const todayEnd=new Date();
        todayEnd.setHours(23,59,999);
        const todaysAttendance=await Attendance.countDocuments({scannedAt:{$gte:todayStart,$lte:todayEnd},})
        return {todaysAttendance};
     
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
   

  } catch (error) {
    console.log(error);
    return response.status(500).json({
      error: "Internal Server Error",
    });
  }
},


async recentAttendance(request,response){
    try{

        const recentAttendance=await Attendance.find().sort({ scannedAt: -1 }).populate("student", "name email").populate("teacher", "name");
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




export default adminControllerDashboard;







// export const getAllStudentsWithAttendance = async (req, res) => {
//   try {
//     // Get all students
//     const students = await User.find({ role: "student" })
//       .select("name email class");

//     // Get attendance records
//     const attendanceRecords = await Attendance.find({})
//       .populate("student", "email");

//     // Merge student data with attendance
//     const finalData = students.map((student) => {
//       const record = attendanceRecords.find(
//         (att) => att.student?.email === student.email
//       );

//       return {
//         name: student.name,
//         email: student.email,
//         class: student.class || "N/A",
//         date: record ? new Date(record.scannedAt).toLocaleDateString() : "N/A",
//         record: record ? record.status : "absent", // default absent if no record
//       };
//     });

//     res.status(200).json({ data: finalData });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };




// export const getAllStudentsWithAttendance = async (req, res) => {
//   try {
//     // Get all students
//     const students = await User.find({ role: "student" })
//       .select("name email class");

//     // Get all attendance records
//     const attendanceRecords = await Attendance.find({})
//       .populate("student", "email");

//     // Merge student data with all attendance
//     const finalData = [];

//     students.forEach((student) => {
//       // उस student के सारे attendance records
//       const records = attendanceRecords.filter(
//         (att) => att.student?.email === student.email
//       );

//       if (records.length > 0) {
//         records.forEach((rec) => {
//           finalData.push({
//             name: student.name,
//             email: student.email,
//             class: student.class || "N/A",
//             date: rec.scannedAt ? new Date(rec.scannedAt).toLocaleDateString() : "N/A",
//             record: rec.status || "absent",
//           });
//         });
//       } else {
//         // अगर student का कोई attendance नहीं है तो default absent दिखाओ
//         finalData.push({
//           name: student.name,
//           email: student.email,
//           class: student.class || "N/A",
//           date: "N/A",
//           record: "absent",
//         });
//       }
//     });

//     res.status(200).json({ data: finalData });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };




export const getAllStudentsWithAttendance = async (req, res) => {
  try {
    // all  students
    const students = await User.find({ role: "student" })
      .select("name email class");

    // all attendance records
    const attendanceRecords = await Attendance.find({})
      .populate("student", "email");

    //  Step 1: min and max data find
    const allDates = attendanceRecords.map((rec) => rec.scannedAt);
    const minDate = allDates.length > 0 ? new Date(Math.min(...allDates)) : new Date();
    const maxDate = new Date(); // now date 

    // make a all renge 
    const dateRange = [];
    let d = new Date(minDate);
    while (d <= maxDate) {
      dateRange.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }

    // stuudent and detae wise attendance marge karo
    const finalData = [];

    students.forEach((student) => {
      dateRange.forEach((date) => {
        const record = attendanceRecords.find(
          (att) =>
            att.student?.email === student.email &&
            new Date(att.scannedAt).toDateString() === date.toDateString()
        );

        finalData.push({
          name: student.name,
          email: student.email,
          class: student.class || "N/A",
          date: date.toLocaleDateString(),   // this line for add curenct date 
          record: record ? record.status : "absent",
        });
      });
    });

    res.status(200).json({ data: finalData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
