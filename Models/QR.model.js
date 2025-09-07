
import mongoose from "mongoose";

const qrSchema = mongoose.Schema({
     qrId: {
       type: String,
        required: true,
         unique: true 
        },
  code: { 
    type: String,
     required: true
     }, 
  teacher: 
  { 
    type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: 
  { 
    type: Date,
     default: Date.now
     },
  expiresAt: 
  { type: Date, 
    required: true 
  },

  used: { type: Boolean, default: false }
,


//update code 
  location: { 
      latitude: { 
        type: Number,
         required: true 
        },
      longitude: {
         type: Number, 
         required: true
         },
      radiusMeters: { 
        type: Number,
         default: 50 
        }
  }
});

export const QR = mongoose.model("QR", qrSchema);



