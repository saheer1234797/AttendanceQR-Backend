

import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
student: {
   type: mongoose.Schema.Types.ObjectId,
    ref: "User",
     required: true },


  teacher: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ["present", "absent"], default: "present" },
  scannedAt:
   {
     type: Date,
      default: Date.now
     }
}, { timestamps: true });

export const Attendance = mongoose.model("Attendance", AttendanceSchema);
