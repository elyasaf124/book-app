export const globalErrorHandlerNew = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err.name === 'ValidationError') {
        err.statusCode = 400;
        err.errorMessage = err.errors.description.properties.message;
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.errorMessage
        });
    }

    // Send error response to client
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
};

export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

