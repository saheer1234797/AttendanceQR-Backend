// import { User } from "../Models/User.model.js";
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken'
// import dotenv from 'dotenv';
// import { realpath } from "fs";


// dotenv.config();

// const userController={
//     // 1 User Registartion      
//     async register(request,response){
//         try{
//            let{name,email,password,role,rollNumber}=request.body;
// // add something 
// if(role!=="admin"&& request.user.role !=="admin"){
//     return response.status(403).json({message:"Only admin can create teacher/student acount"})
// }

//  if (!req.user && role === "admin") {
//             return res.status(403).json({ message: "You cannot create an admin account directly" });
//         }


//             if (req.user && req.user.role === "admin") {
//             if (role === "admin") {
//                 return res.status(403).json({ message: "Only one admin allowed" });
//             }
//         } else if (role !== "student") {

//             return res.status(403).json({ message: "Only admin can create teacher accounts" });
//         }



// //






//             const existingUser=await User.findOne({email});
//             if(existingUser){
//                 return response.status(400).json({message:"User alredy register"});
//             }
//             const salt=await bcrypt.genSaltSync(12);
//             password=await bcrypt.hashSync(password,salt);
//             const user=await User.create({name,email,password,role,rollNumber});
//             return response.status(201).json({message:"Registartion sucessfull ",data:user})

//         }catch(error){
//             console.log(error);
//             return response.status(500).json({error:"Internal server Error "});
            

//         }
//     }
// ,
//     ///2 login
//     async login(request,response){
//         try{

//           let {email,password}=request.body;
      
//             const user=await User.findOne({email});
//             if(!user){
//                 return response.status(400).json({message:"Invalid Emial or Password"});
//             }
//             const isMatch=await bcrypt.compare(password,user.password);
//             if(!isMatch){
//                 return response.status(400).json({message:"Invalid email or Pasword "});
//             }
//             const token=jwt.sign({id:user._id,role:user.role},process.env.SECRET_KEY,{
//                 expiresIn:"1d"
//             });
//            response.cookie("token", token);
// ///////add
//  request.session.user = {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//        rollNumber: user.rollNumber
//     };
// ////add




//             return response.status(200).json({message:"Login sucessfull ",data:user});
// //////add 
          
// ///
//         }catch(errro){
//             console.log(errro);
//             return response.status(500).json({error:"Inernal server Error "});
            

//         }
//     }

//     ,

//   async logout(request,response){
//     try{
//         response.clearCookie('token');
//         return response.status(200).json({message:"Logout sucessful"});

//     }catch(error){
//         return response.status(500).json({error:"Internal server Error "});
//     }
//   },


//   ///new API for profile 
// async profile(request,response){
//     try{
//         if(!request.session.user){
//             return response.status(401).json({message:"Not Logged In"});
//         }
//         response.json({user:request.session.user});

//     }catch(error){
//         return response.status(500).json({message:"Internal server Error "});

//     }
// }




// }




// export default userController;



///uper wala final wala hai 








import { User } from "../Models/User.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const userController = {
  // ✅ Register User (Admin only)
  async register(request, response) {
    try {
      let { name, email, password, role, rollNumber } = request.body;

      // Prevent creating admin accounts
      if (role === "admin") {
        return response.status(403).json({ message: "You cannot create an admin account" });
      }

      // Check if already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return response.status(400).json({ message: "User already registered" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(12);
      password = await bcrypt.hash(password, salt);

      const user = await User.create({ name, email, password, role, rollNumber });
      return response.status(201).json({ message: "Registration successful", data: user });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: "Internal server error" });
    }
  },

  // ✅ Login
  async login(request, response) {
    try {
      let { email, password } = request.body;

      const user = await User.findOne({ email });
      if (!user) {
        return response.status(400).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, {
        expiresIn: "1d",
      });

      // Save token in cookie
      response.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return response.status(200).json({ message: "Login successful", data: user,token });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: "Internal server error" });
    }
  },

  // ✅ Logout
  async logout(request, response) {
    try {
      response.clearCookie("token");
      return response.status(200).json({ message: "Logout successful" });
    } catch (error) {
      return response.status(500).json({ error: "Internal server error" });
    }
  },

  // ✅ Profile
  async profile(request, response) {
    try {
      if (!request.user) {
        return response.status(401).json({ message: "Not logged in" });
      }
      return response.status(200).json({ user: request.user });
    } catch (error) {
      return response.status(500).json({ message: "Internal server error" });
    }
  },
};

export default userController;
