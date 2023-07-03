import { AppError } from "../utilis/appError.js"

export const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

export const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    const message = `Duplicate field value : ${value} please use anther value`
    return new AppError(message, 400)
}

export const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invalid input  data. ${errors.join('. ')}`
    return new AppError(message, 400)
}


export const sendErrorDev = (err, req, res) => {
    //API
    if (req.orginalUrl.startWith('/api')) {

        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })
    } else {
        //RENDERED WEBSITE
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong',
            msg: err.message
        })
    }
}
export const sendErrorProd = (err, req, res) => {
    //Operational, trusted error:send message to the client
    if (err.isOperntinal) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    }
    //Programming or other unknown error: don't leak error details to the client 
    else {
        console.error('ERROR', err)

        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong'
        })
    }
}


export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res)
    } else if (process.env.NODE_ENV === 'producation') {
        let error = { ...err }
        if (error.name === 'CastError') error = handleCastErrorDB(error)
        else if (error.code === 11000) error = handleDuplicateFieldsDB(error)
        else if (error.name === 'ValidationError') error = handleValidationErrorDB(error)


        sendErrorProd(error, req, res)
    }
}
