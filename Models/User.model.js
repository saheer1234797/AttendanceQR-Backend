
import mongoose, { Types } from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
     type: String,
      required: true
     },
  email: 
  { 
    type: String,
     required: true, 
     unique: true
     },
  password:
   { 
    type: String, 
    required: true
   },
  class:
   { 
    type: String
   }, 
  role: { 
    type: String,

  enum: ["admin", "teacher", "student"],
   default: "student"
   },

     rollNumber:{
        type:String,
        unique:true
     }
    
},

{ timestamps: true });

export const User = mongoose.model("User", UserSchema);
































