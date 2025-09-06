import express from 'express';
import geerateQRCOntroller from '../Controllers/QR.controller.js';
import auth1 from '../Middleware/auth1.js';
const router=express.Router();
// router.get('/generateQR',auth1,geerateQRCOntroller.generateQR);
//add something for location
router.post('/generateQR',auth1,geerateQRCOntroller.generateQR);
export default router;  