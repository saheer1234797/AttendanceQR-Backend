// import mongoose from "mongoose";

// const qrSchema=mongoose.Schema({
//     code:{
//         type:String,
//         required:true
//     },
//     student :{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User",
//         required:true
//     },
//     creatAt:{
//         type:Date,
//         default:Date.now
//     },
//     expiresAt:{
//         type:Date,
//         required:true
//     },
//     used:{
//         type:Boolean,
//         default:false
//     }
// });
// export const QR =mongoose.model("QR",qrSchema);


//uper wla working nich for testing



import mongoose from "mongoose";

const qrSchema = mongoose.Schema({
     qrId: { type: String, required: true, unique: true }, //add this for my testin right now ok
  code: { type: String, required: true }, // JSON stringified data of QR
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false }
});

export const QR = mongoose.model("QR", qrSchema);
