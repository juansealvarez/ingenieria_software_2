import express from 'express';

const router = express.Router();

//middleware
import {requireSingin} from '../middlewares'

//Controladores
import  {register,login,logout,currentUser,sendTestEmail} from '../controllers/auth';
import Profile from '../../client/pages/profile';

router.post('/register',register);
router.post("/login", login);
router.get('/logout',logout);
router.get('/current-user', requireSingin, currentUser)
router.get("/send-email", sendTestEmail);
router.get("/upload-cv", Profile);

module.exports = router;

