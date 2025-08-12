import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../Models/User.model.js';

dotenv.config();

const auth = async (request, response, next) => {
  try {
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(" ")[1]; 

    // console.log("Token from header:", token);

    if (!token) {
      return response.status(401).json({ message: "Unauthorized: Token missing" });
    }
console.log("Authorization Header:", request.headers.authorization);//adition 
console.log("Secret Key:", process.env.SECRET_KEY);
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return response.status(401).json({ message: "Unauthorized: User not found" });
    }

    request.user = user;
    next();

  } catch (error) {
    console.log(error);
    response.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default auth;

