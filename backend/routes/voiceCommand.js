import express from 'express';
import { addVoiceCommand } from '../controllers/voiceCommandController.js'; 
import { protect } from '../middleware/auth.js';
const router = express.Router();

router.post('/addVoiceCommand', protect, addVoiceCommand);
export default router;