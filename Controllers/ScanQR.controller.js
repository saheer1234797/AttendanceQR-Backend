
import path from 'path';
import Jimp from 'jimp';
import qrReader from 'qrcode-reader';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { QR } from '../Models/QR.model.js';
import { Attendance } from '../Models/Attendance.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const scanQrController = {
  async scanQR(request, response) {
    try {
      const user = request.user;
      if (user.role !== 'student') {
        return response.status(403).json({ message: "Only students can scan QR codes" });
      }

      const { filename } = request.body;
      const filePath = path.join(__dirname, `../public/qr-codes/${filename}`);

      if (!fs.existsSync(filePath)) {
        return response.status(404).json({ message: 'QR file not found' });
      }

      const buffer = fs.readFileSync(filePath);
      const image = await Jimp.read(buffer);

      const qr = new qrReader();

      qr.callback = async (error, value) => {
        if (error || !value?.result) {
          return response.status(400).json({ message: 'Invalid QR Code' });
        }

        const qrData = JSON.parse(value.result);

  const qrDoc = await QR.findOne({ qrId: qrData.qrId, used: false });

        if (!qrDoc) {
          return response.status(400).json({ message: 'QR Code is invalid or already used' });
        }

        // Check expiry
        if (new Date() > qrDoc.expiresAt) {
          return response.status(400).json({ message: 'QR Code has expired' });
        }

        // Check if attendance already marked today for this student and teacher
        const today = new Date();
        const start = new Date(today.setHours(0, 0, 0, 0));
        const end = new Date(today.setHours(23, 59, 59, 999));

        const alreadyMarked = await Attendance.findOne({
          student: user._id,
          teacher: qrDoc.teacher,
          scannedAt: { $gte: start, $lte: end },
        });

        if (alreadyMarked) {
          return response.status(400).json({ message: 'Attendance already marked today' });
        }

      
        const attendance = await Attendance.create({
          student: user._id,
          teacher: qrDoc.teacher,
          status: 'present',
          scannedAt: new Date()
        });


        return response.status(200).json({ message: 'Attendance marked successfully', attendance });
      };

      qr.decode(image.bitmap);

    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Failed to mark attendance' });
    }
  }
};

export default scanQrController;
