import express from 'express'
import {
    addToCart, updateCart,
    deleteItem, deleteAll,
    createCheckOutSession,
    updateQuantityBooks
} from '../controllers/bookingController.js'
import { protect } from '../controllers/authController.js'


export const router = express.Router();

router.use(protect)

router.post('/create-checkout-session', createCheckOutSession)

router.post('/addToCart', addToCart)

router.patch('/updateCart', updateCart)

router.patch('/deleteItem', deleteItem)

router.patch('/deleteAll', deleteAll)

router.patch('/updateQuantityBooks', updateQuantityBooks)

