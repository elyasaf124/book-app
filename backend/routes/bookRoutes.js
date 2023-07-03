import express from 'express'
import { presignedURL, getAllBook, postNewBook, setBookUserId, updateBook, search, getBook, deleteBook, getAllBooksConfirm, sendBookToConfirm, deleteBookConfirm } from '../controllers/bookController.js'
import { protect } from '../controllers/authController.js'


export const router = express.Router();

router.use(protect)

router
    .route('/')
    .get(getAllBook)
    .post(setBookUserId, postNewBook)

router.patch('/editBook/:id', updateBook)

router.get('/search', search)

router.get('/get-signature', presignedURL)

router.post('/sendBookToConfirm', sendBookToConfirm)

router.get('/getAllBooksConfirm', getAllBooksConfirm)




router
    .route('/bookConfirm/:id')
    .delete(deleteBookConfirm)

router
    .route('/:id')
    .get(getBook)
    .delete(deleteBook)

