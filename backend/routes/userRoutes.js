import express from 'express'
import { myBooks, myCart, updateMe, updateUser, deleteMe, getAllUsers, getUserByEmail, getUser, getMe } from '../controllers/userController.js'
import { signup, login, forgotPassword, resetPassword, protect, logOut, updatePassword, restrictTo, } from '../controllers/authController.js'

export const router = express.Router();

router.post('/signup', signup)

router.post('/login', login)

router.post('/forgotPassword', forgotPassword)

router.patch('/resetPassword/:token', resetPassword)

router.use(protect)

router.get('/logout', logOut)

router.get('/myBooks', myBooks)

router.get('/myCart', myCart)

router.patch('/updatePassword', updatePassword)

router.patch('/updateMe', updateMe)

router.get('/getMe', getMe)

router.patch('/deleteMe/:id', deleteMe)

router.get('/', restrictTo('admin'), getAllUsers)

router.get('/getUserByEmail/:email', getUserByEmail)

router.route('/:id')
    .get(getUser)
    .patch(updateUser)

