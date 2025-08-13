
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../Models/User.model.js';

dotenv.config();

const auth1 = async (request, response, next) => {
  try {
    let token = null;

 
    if (request.cookies && request.cookies.token) {
      token = request.cookies.token;
    }


    if (!token && request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
      token = request.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return response.status(401).json({ message: "Unauthorized: Token missing" });
    }


    const decoded = jwt.verify(token, process.env.SECRET_KEY);

 
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return response.status(401).json({ message: "Unauthorized: User not found" });
    }

   
    request.user = user;
    next();
  } catch (error) {
    console.error(error);
    response.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default auth1;
