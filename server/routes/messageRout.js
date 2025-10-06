import express from 'express';
import {protectRoute} from "../middleware/auth.js"
import { getmessage, getUerforSidebar, markMessageAsSeen, sendMessage } from '../controllers/messageController.js';

const messageRouter = express.Router();

messageRouter.get('/users',protectRoute,getUerforSidebar)
messageRouter.get('/:id',protectRoute,getmessage)
messageRouter.put('/mark/:id',protectRoute,markMessageAsSeen)
messageRouter.post('/send/:id',protectRoute,sendMessage)

export default messageRouter;