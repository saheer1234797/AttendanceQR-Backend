
// //new    ye walw niche wla wshai hai re baaba 
// import mongoose, { Types } from "mongoose";

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   class: { type: String }, // Only for students
//   role: { type: String,

//      enum: ["student", "teacher"], default: "student" },
// ///yhha add abhi kiya mane bs 
//      rollNumber:{
//         type:String,
//         unique:true
//      }
//      ///
// },







// { timestamps: true });

// export const User = mongoose.model("User", UserSchema);









import mongoose, { Types } from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  class: { type: String }, // Only for students
  role: { type: String,

  enum: ["admin", "teacher", "student"], default: "student" },
///yhha add abhi kiya mane bs 
     rollNumber:{
        type:String,
        unique:true
     }
     ///
},







{ timestamps: true });

export const User = mongoose.model("User", UserSchema);
































