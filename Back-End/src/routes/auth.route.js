import express from 'express'
import { login, logout, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup );

router.post('/login',login );

router.post('/logout', logout);

router.put("/update-profile",protectRoute,  updateProfile) //we protect the route so that it can only be accesed by the authenticated users

export default router;