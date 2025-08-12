import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv'
import userRoute from './Routes/User.route.js'
import qrRoute from './Routes/QR.route.js'
import scanQRroute from './Routes/ScanQR.route.js';
import AttendceRoute from './Routes/Attendace.route.js'
import adminrouter from './Routes/admin.route.js'
import session from "express-session";
///

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ESM में __dirname और __filename खुद से नहीं आता,
// ये manually बनाना पड़ेगा
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

///


import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
dotenv.config();
const app=express();
app.use("/qr-codes", express.static(path.join(__dirname, "public", "qr-codes")));

mongoose.connect(process.env.MONGO_URL).then(result=>{
   const FRONTEND = 'http://localhost:3001';

app.use(cors({ origin: FRONTEND, credentials: true }));
//addd
app.use(session({
  secret: "my-secret-key", // strong secret
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // dev में false, production में true + https
}));
///add 
 
app.use(bodyParser.json());
app.use(cookieParser());  
app.use(bodyParser.urlencoded({extended:true}));
app.use('/user',userRoute);
app.use('/qr',qrRoute);
app.use('/scanQR',scanQRroute);
app.use('/Attendce',AttendceRoute);
app.use('/admin',adminrouter);


app.listen(process.env.PORT,()=>{
    console.log("Server Started....");
    
})
}).catch(error=>{
   
    
    console.log("data bases not connected ...");
     console.log(error);
    
});

