// import QRCode from 'qrcode';
// import path from 'path';
// import { v4 as uuidv4 } from 'uuid';
// import { QR } from '../Models/QR.model.js';
// import fs from 'fs';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const generateQRController = {
//   async generateQR(request, response) {
//     try {
//       const user = request.user;
      
//       // if (user.role !== 'student') {
//       //   return response.status(403).json({ message: "Only students can generate QR codes." });
//       // }

//       //add for teacher ok  
      
//        if (user.role !== 'teacher') {
//         return response.status(403).json({ message: "Only teachers can generate QR codes" });
//       }


//       const qrData = {
       
//         studentId: user._id,
//         name: user.name,
//         email: user.email,
//         uuid: uuidv4(),
//         timeStamp: new Date().toISOString()
//       };

//       const qrString = JSON.stringify(qrData);

//       const qrDir = path.join(__dirname, '../public/qr-codes');
//       if (!fs.existsSync(qrDir)) {
//         fs.mkdirSync(qrDir, { recursive: true });
//       }

//       const qrImagePath = path.join(qrDir, `${user._id}.png`);

//       await QRCode.toFile(qrImagePath, qrString);

//       response.status(200).json({
//         message: "QR Code generated successfully",
//         filePath: `/public/qr-codes/${user._id}.png`,
//         qrData
//       });

//     } catch (error) {
//       console.error("QR Generation Error:", error);
//       response.status(500).json({ message: "Failed to generate QR Code" });
//     }
//   }
// };

// export default generateQRController;



//uper wala working hai niche wall  fro testing kai liye hai bs







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

      // QR data object में teacher info डालो
      const qrData = {
        qrId: uuidv4(),  // unique id for QR
        teacherId: user._id,
        teacherName: user.name,
        timeStamp: new Date().toISOString(),
      };

      const qrString = JSON.stringify(qrData);

      // QR code image directory और path
      const qrDir = path.join(__dirname, '../public/qr-codes');
      if (!fs.existsSync(qrDir)) {
        fs.mkdirSync(qrDir, { recursive: true });
      }

      const qrImagePath = path.join(qrDir, `${qrData.qrId}.png`);

      // QR image बनाओ
      await QRCode.toFile(qrImagePath, qrString);

      // QR DB में save करो
      const newQR = new QR({
          qrId: qrData.qrId,//i am add this line ok
        code: qrString,
        teacher: user._id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 घंटे बाद expire होगा (उदाहरण)
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
