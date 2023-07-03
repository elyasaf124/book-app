import { Book } from '../models/bookModule.js'
import { BookConfirm } from '../models/booksConfirmModule.js'
import { User } from '../models/userModule.js'
import { AppError } from '../utilis/appError.js'
import { catchWrapper as catchAsync } from '../utilis/catchAsync.js'
import cloudinary from 'cloudinary'


cloudinary.v2.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPIKEY,
    api_secret: process.env.CLOUDINARYSECRET,
    secure: true
});

export const presignedURL = (req, res, next) => {
    const timestamp = Math.round(new Date() / 1000);
    const params = {
        timestamp: timestamp
    };
    const signature = cloudinary.v2.utils.api_sign_request(
        params,
        process.env.CLOUDINARYSECRET
    );
    res.json({ timestamp, signature });
};


export const getAllBook = catchAsync(async (req, res, next) => {
    const books = await Book.find({})

    res.status(200).json({
        status: 'success',
        results: books.length,
        data: {
            books
        }
    })
})

export const getAllBooksConfirm = catchAsync(async (req, res, next) => {
    const books = await BookConfirm.find({})

    res.status(200).json({
        status: 'success',
        results: books.length,
        data: {
            books
        }
    })
})

export const getBook = catchAsync(async (req, res, next) => {
    try {
        const book = await Book.find({ _id: { $eq: req.params.id } })
        if (book.length < 1) {
            throw new AppError('No book found with that ID', 404)
        }
        res.status(200).json({
            status: 'success',
            data: {
                book
            }
        })
    } catch (error) {
        next(error)
    }
})

export const deleteBook = catchAsync(async (req, res, next) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id)
        if (!book) {
            throw new AppError('No book found with that ID', 404)
        }

        res.status(204).json({
            status: 'success',
            data: {
                book
            }
        })
    } catch (error) {
        next(error)
    }
})

export const deleteBookConfirm = catchAsync(async (req, res, next) => {
    try {
        const book = await BookConfirm.findByIdAndDelete(req.params.id)
        if (!book) {
            throw new AppError('No book found with that ID', 404)
        }

        res.status(204).json({
            status: 'success',
        })
    } catch (error) {
        next(error)
    }
})

export const setBookUserId = (req, res, next) => {
    if (!req.body.uploadBy) req.body.uploadBy = req.user._id;
    next()
}

export const postNewBook = catchAsync(async (req, res, next) => {
    try {
        delete req.body.book._id;
        const newBook = await Book.create(req.body.book);
        if (!newBook) {
            throw new AppError("there is a problem with save book", 400)
        }

        await User.findByIdAndUpdate(req.body.book.uploadBy, { $push: { myBooks: newBook._id } });

        res.status(200).json({
            status: 'success',
            data: {
                newBook
            }
        });
    } catch (error) {
        next(error)
    }
});



export const sendBookToConfirm = async (req, res, next) => {
    const expectedSignature = await cloudinary.utils.api_sign_request({
        public_id: req.body.book.image.public_id,
        version: req.body.book.image.version
    },
        process.env.CLOUDINARYSECRET)
    if (expectedSignature === req.body.book.image.signature) {
        try {
            const newBook = await BookConfirm.create(req.body.book);

            if (!newBook) {
                throw new AppError('There is a problem with sending your book. Please try again later.', 400);
            }

            res.status(200).json({
                data: {
                    newBook
                }
            });
        } catch (error) {
            next(error);
        }
    }
};

const filterObj = (obj, ...fields) => {
    let newObj = {}
    Object.keys(obj).forEach(el => {
        if (fields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
}

export const updateBook = catchAsync(async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id)
        if (!book.uploadBy == req.user.id) {
            throw new AppError("this is no tour book please select your book", 400)
        }
        const filteritem = filterObj(req.body, "title", "year")
        const bookup = await Book.findByIdAndUpdate(req.params.id, filteritem, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: "success",
            bookup
        })
    } catch (error) {
        next(error)
    }

})

export const search = catchAsync(async (req, res, next) => {
    let search = req.query.search
    let cate2 = req.query.cate
    let cate = []
    let arrCate
    let data
    let data1

    if (cate2) {
        arrCate = req.query.cate.includes(',')
        arrCate === true ? cate = req.query.cate.split(',') : cate.push(req.query.cate)

        if (search) {
            data = await Book.find({ title: { $regex: search } })
            data1 = data.filter((el, i) => {
                return cate.find((item, i) => {
                    return el.categories.find(bookCategory => bookCategory === item);
                })
            })
        }
        if (!search) {
            data = await Book.find({})
            data1 = data.filter((el, i) => {
                return cate.find((item, i) => {
                    return el.categories[0] == item
                })
            })
        }
    }

    if (!cate2 && search) {
        data1 = await Book.find({ title: { $regex: search } })
    }

    if (!search && !cate2) {
        data1 = await Book.find({})
    }

    res.status(200).json({
        status: 'success',
        data1
    })
})

