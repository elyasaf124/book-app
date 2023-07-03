import express from 'express'
import { auth, protect } from '../controllers/authController.js'


export const router = express.Router();

router.use(protect)

router.get('/', auth)


