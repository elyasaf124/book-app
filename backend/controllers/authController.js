import { User } from '../models/userModule.js';
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { promisify } from 'util';
import { sendEmail } from '../utilis/email.js';
import { AppError } from '../utilis/appError.js';

export const auth = (req, res, next) => {
    res.status(200).json({
        user: req.user
    })
}

export const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: "90d"
    })
}

export const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        secure: false,
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

    res.cookie('jwt', token, cookieOptions)

    user.password = undefined

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

//בצורת כתיבה הזאת בעצם מוודאים שרק השדות הרשומות יוכלו להישמר בדאטה בייס
export const signup = async (req, res, next) => {
    const newUser = await User.create({
        firstName: req.body.user.firstName,
        age: req.body.user.age,
        gender: req.body.user.gender,
        email: req.body.user.email,
        password: req.body.user.password,
        passwordConfirm: req.body.user.passwordConfirm,
        role: req.body.role,
    })
    createSendToken(newUser, 201, res)
    next()
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email | !password) throw new AppError('you miss email or password details', 400)

        const user = await User.findOne({ email: email }).select('+password')

        if (!user || !(await user.correctPassword(password, user.password))) {
            throw new AppError('there is incorrect password or email', 400)
        }

        createSendToken(user, 200, res)
    } catch (error) {
        next(error)
    }
}


export const logOut = async (req, res, next) => {
    res.cookie('jwt', 'ss', {
        expires: new Date(Date.now() + 1 * 10),
        secure: false,
        httpOnly: true
    })
    res.status(200).json({ status: "success" })
}

export const protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) return next()

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return console.log('user dont find', 400)


    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) return next()

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
};


export const checkLogin = (req, res, next) => {
    try {
        if (req.user) {
            res.status(200).json({
                data: req.user.firstName
            })
        } else {
            throw new AppError("there is a problem", 400)
        }
    } catch (error) {
        next(error)
    }
    next()
}



export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return console.log('You do not have permission to perform this action', 403)
        }
        next()
    }
}

export const forgotPassword = async (req, res, next) => {
    try {
        // 1) Get user based on POSTed email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            throw new AppError('There is no user with email address.', 404)
        }
        // 2) Generate the random reset token
        const resetToken = user.createPasswordReseToken();
        await user.save({ validateBeforeSave: false })

        const resetUrl = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`
        const msg = `you have 10 minute to change your password ${resetUrl}.
        if you dont request change password please ignore this msg`

        const options = {
            msg: msg,
            to: user.email,
            subject: 'your password reset token(valid for 10 min)'
        }

        await sendEmail(options)

        res.status(200).json({
            status: "success",
            msg: 'Token sent to email'
        })

    } catch (error) {
        user.resetToken = undefined
        user.passwordResetExpires = undefined
        user.passwordResetToken = undefined

        await user.save({ validateBeforeSave: false })

        throw new AppError('There was an error sending the email. try again later', 500)
    }
    await user.save({ validateBeforeSave: false })
}


export const resetPassword = async (req, res, next) => {
    try {
        const hasepass = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');
        const user = await User.findOne({ passwordResetToken: hasepass, passwordResetExpires: { $gt: Date.now() } })
        if (!user) {
            throw new AppError('there is a problem with your token', 400)
        }

        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm
        user.passwordResetExpires = undefined
        user.passwordResetToken = undefined

        await user.save()

        createSendToken(user, 200, res)

    } catch (error) {
        next(error)
    }
}

export const updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password')

        if (!user) {
            throw new AppError('there is a problem please try again later', 400)
        }

        const validPass = await user.correctPassword(req.body.currentPassword, user.password)

        if (!validPass) {
            throw new AppError('current password are not correct please try again', 400)
        }

        if (req.body.newPassword !== req.body.passwordConfirm) {
            throw new AppError('newPassword and confirm password must be the same', 400)
        }

        user.password = req.body.newPassword
        user.passwordConfirm = req.body.passwordConfirm

        await user.save()

        createSendToken(user, 200, res)
    } catch (error) {
        next(error)
    }
}

