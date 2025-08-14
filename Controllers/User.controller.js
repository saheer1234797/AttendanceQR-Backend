


import { User } from "../Models/User.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const userController = {

  async register(request, response) {
    try {
      let { name, email, password, role, rollNumber } = request.body;

      if (role === "admin") {
        return response.status(403).json({ message: "You cannot create an admin account" });
      }

   
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return response.status(400).json({ message: "User already registered" });
      }

     
      const salt = await bcrypt.genSalt(12);
      password = await bcrypt.hash(password, salt);

      const user = await User.create({ name, email, password, role, rollNumber });
      return response.status(201).json({ message: "Registration successful", data: user });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: "Internal server error" });
    }
  },


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

 
  async logout(request, response) {
    try {
      response.clearCookie("token");
      return response.status(200).json({ message: "Logout successful" });
    } catch (error) {
      return response.status(500).json({ error: "Internal server error" });
    }
  },


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






