import mongoose from "mongoose";
const courseSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    students:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
      teacher: {
         type: mongoose.Schema.Types.ObjectId,
          ref: "User"
         },

           createdAt: { 
            type: Date, 
            default: Date.now 
        }

});
export const Course=mongoose.model("Course",courseSchema);