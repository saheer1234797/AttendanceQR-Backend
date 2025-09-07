

import { QR } from '../Models/QR.model.js';
import { Attendance } from '../Models/Attendance.model.js';
import { getDistance } from 'geolib';

const scanQrController = {
  async scanQR(request, response) {
    try {
      const user = request.user;

      if (user.role !== 'student') {
        return response.status(403).json({ message: "Only students can scan QR codes" });
      }

      const { qrId, latitude, longitude } = request.body;
   
      
       

      if (!qrId) {
        return response.status(400).json({ message: 'QR ID is required' });
      }

      const qrDoc = await QR.findOne({ qrId });
      if (!qrDoc) {
        return response.status(400).json({ message: 'QR Code is invalid' });
      }

      if (new Date() > qrDoc.expiresAt) {
        return response.status(400).json({ message: 'QR Code has expired' });
      }

      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return response.status(400).json({ message: 'Student location is required' });
      }

  
      const distance = getDistance(
        { latitude, longitude },
        { latitude: qrDoc.location.latitude, longitude: qrDoc.location.longitude }
      );
       
      if (distance > qrDoc.location.radiusMeters) {

        return response.status(400).json({ message: `Invalid Location! You are ${distance}m away.` });
      }
   
      
      



      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

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
        scannedAt: new Date(),
      });

      return response.status(200).json({
        message: 'Attendance marked successfully',
        attendance,
      });



    } catch (error) {
      console.error("Scan Error:", error);
      response.status(500).json({ message: 'Failed to mark attendance' });
    }
  },
};

export default scanQrController;
