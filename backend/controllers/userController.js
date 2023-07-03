import { User } from '../models/userModule.js';
import { AppError } from '../utilis/appError.js';


export const getAllUsers = async (req, res) => {
    const users = await User.find({})

    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    })
}

export const getUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.find({ _id: id })

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error
        })
    }
}

export const getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email
        const user = await User.find({ email: email })

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = req.user
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail'
        })
    }
}

export const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

export const updateUser = async (req, res) => {
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'firstName', 'email');
    const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
}

export const deleteMe = async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { active: false })

    res.status(204).json({
        status: "success",
        data: null
    })
}

export const updateMe = async (req, res, next) => {
    try {
        if (req.body.password || req.body.passwordConfirm) {
            throw new AppError('This route is not for updating password. Please use updatePassword to change your password.', 400);
        }
        const filteredBody = filterObj(req.body.updateUser, 'firstName', 'email', 'lastName', 'tel');
        const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
            new: true,
            runValidators: true
        });

        if (!user) {
            throw new AppError('No user found with that ID', 404)
        }

        res.status(200).json({
            status: "success",
            data: {
                user
            }
        });
    } catch (error) {
        next(error); // Or any other appropriate status code
    }
}

export const myBooks = async (req, res, next) => {
    const myBooks = await User.findOne({ _id: req.user._id }).populate({ path: 'myBooks' })
    const books = myBooks.myBooks
    res.status(200).json({
        status: "success",
        data: {
            books
        }
    })

}
export const myCart = async (req, res, next) => {
    const myCart = await User.findOne({ _id: req.user._id }).populate({ path: 'myCart', populate: { path: 'type', model: 'Book' } })
    const cart = myCart.myCart
    res.status(200).json({
        status: "success",
        data: {
            cart
        }
    })

}
