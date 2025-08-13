import express from 'express';
import scanQrController from '../Controllers/ScanQR.controller.js';
import auth1 from '../Middleware/auth1.js';
const router=express.Router();

router.post('/scanQR',auth1,scanQrController.scanQR);
export default router;