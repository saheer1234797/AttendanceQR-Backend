
import QRCode from 'qrcode';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { QR } from '../Models/QR.model.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generateQRController = {
  async generateQR(request, response) {
    try {
      const user = request.user;


      if (user.role !== 'teacher') {
        return response.status(403).json({ message: "Only teachers can generate QR codes" });
      }

    
      const latitude=22.715272152852528;
      const longitude=75.84408362255719;
        const radiusMeters =  10;
        // const radiusMeters=25000; 
  
   
      
    

      const qrData = {
        qrId: uuidv4(),
        teacherId: user._id,
        teacherName: user.name,
        timeStamp: new Date().toISOString(),
        location: { latitude, longitude, radiusMeters }
      };

      const qrString = JSON.stringify(qrData);

      const qrDir = path.join(__dirname, '../public/qr-codes');
      if (!fs.existsSync(qrDir)) {
        fs.mkdirSync(qrDir, { recursive: true });
      }

      const qrImagePath = path.join(qrDir, `${qrData.qrId}.png`);
      await QRCode.toFile(qrImagePath, qrString);

      const newQR = new QR({
        qrId: qrData.qrId,
        code: qrString,
        teacher: user._id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour expiry
      
        location: { latitude, longitude, radiusMeters }
      });

      await newQR.save();

      response.status(200).json({
        message: "QR Code generated successfully",
        filePath: `/public/qr-codes/${qrData.qrId}.png`,
        qrData: qrData,
      });

    } catch (error) {
      console.error("QR Generation Error:", error);
      response.status(500).json({ message: "Failed to generate QR Code" });
    }
  }
};

export default generateQRController;



