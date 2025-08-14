// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors'
// import dotenv from 'dotenv'
// import userRoute from './Routes/User.route.js'
// import qrRoute from './Routes/QR.route.js'
// import scanQRroute from './Routes/ScanQR.route.js';
// import AttendceRoute from './Routes/Attendace.route.js'
// import adminrouter from './Routes/admin.route.js'
// import session from "express-session";
// import contactRoutes from "./Routes/contact.route.js"


// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);



// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
// dotenv.config();
// const app=express();
// app.use("/qr-codes", express.static(path.join(__dirname, "public", "qr-codes")));

// mongoose.connect(process.env.MONGO_URL).then(result=>{
//   //  const FRONTEND = 'http://localhost:3001';
//    const FRONTEND="https://attendanceqr-frontend.onrender.com";


// app.use(cors({ origin: FRONTEND, credentials: true }));

// app.use(session({
//   secret: "my-secret-key", 
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: false } 
// }));

 
// app.use(bodyParser.json());
// app.use(cookieParser());  
// app.use(bodyParser.urlencoded({extended:true}));
// app.use('/user',userRoute);
// app.use('/qr',qrRoute);
// app.use('/scanQR',scanQRroute);
// app.use('/Attendce',AttendceRoute);
// app.use('/admin',adminrouter);
// app.use("/email",contactRoutes);


// app.listen(process.env.PORT,()=>{
//     console.log("Server Started....");
    
// })
// }).catch(error=>{
   
    
//     console.log("data bases not connected ...");
//      console.log(error);
    
// });




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

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const FRONTEND = [
    'http://localhost:3000', 
    'https://attendanceqr-frontend.onrender.com' 
];


app.use(cors({
    origin: FRONTEND,
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


app.use('/user', userRoute);
app.use('/qr', qrRoute);
app.use('/scanQR', scanQRroute);
app.use('/Attendce', AttendceRoute);
app.use('/admin', adminrouter);
app.use("/email", contactRoutes);


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
