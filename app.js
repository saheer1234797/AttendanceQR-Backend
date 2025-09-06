import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// Routes
import userRoute from './Routes/User.route.js';
import qrRoute from './Routes/QR.route.js';
import scanQRroute from './Routes/ScanQR.route.js';
import AttendceRoute from './Routes/Attendace.route.js';
import adminrouter from './Routes/admin.route.js';
import contactRoutes from './Routes/contact.route.js';
import passwordrouter from "./Routes/password.route.js"
import bulkrouter from "./Routes/BulkStudent.route.js"


dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const allowedOrigins = [
  "http://localhost:3001", 
  "http://localhost:3000",
  "https://attendanceqr-frontend.onrender.com"
];


app.use(cors({
    origin:function(origin,callback){
        if(!origin||allowedOrigins.includes(origin)){
            callback(null,true);
        }else{
            callback(new Error("not allowed by cors"));
        }
    },
    // origin: FRONTEND,
    //  origin:"https://attendanceqr-frontend.onrender.com",
    // origin:"http://localhost:3001",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));


app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));


app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/qr-codes", express.static(path.join(__dirname, "public", "qr-codes")));

app.use("/password",passwordrouter);
app.use('/user', userRoute);
app.use('/qr', qrRoute);
app.use('/scanQR', scanQRroute);
app.use('/Attendce', AttendceRoute);
app.use('/admin', adminrouter);
app.use("/email", contactRoutes);
app.use("/bulk",bulkrouter );


mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log(" Database connected");
        app.listen(process.env.PORT, () => {
            console.log(` Server running on port ${process.env.PORT}`);
        });
    })
    .catch(error => {
        console.error(" Database not connected", error);
    });

