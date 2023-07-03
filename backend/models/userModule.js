import crypto from 'crypto'
import mongoose from 'mongoose'
import validator from 'validator';
import bcrypt from 'bcrypt'


export const userShcema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'user must have first name'],
        minlength: [2, 'name must include at list 2 cher']
    },
    lastName: {
        type: String,
        minlength: [2, 'name must include at list 2 cher']
    },
    age: {
        type: Number,
        required: [true, 'user must have age']
    },
    tel: {
        type: Number,
    },
    city: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['male', "female"]
    },
    email: {
        type: String,
        required: [true, 'A user must have a email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email']
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: 'role must inclue admin or user'
        },
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        select: false,
        required: [true, 'please confirm your passeword'],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            msg: 'password are not same'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    myBooks: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
        default: []
    }],
    myCart: [{
        type: {
            type: mongoose.Schema.ObjectId,
            ref: 'Book',
        },
        quantity: Number,
    }],
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    passwordResetToken: String,
    passwordResetExpires: Date
})

userShcema.pre('save', async function (next) {
    //עובד רק אם הסיסמא שונתה
    if (!this.isModified('password')) return next();

    //אם שונתה הסיסמא אז תצפין אותה
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined
    next()
})


//רק משתמשים שהם לא אנאקטיב יכולים להשתמש בשיטות פיינד
userShcema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

userShcema.methods.correctPassword = async function (password, userPassword) {
    return await bcrypt.compare(password, userPassword)
}

userShcema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

userShcema.methods.createPasswordReseToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken
};

export const User = mongoose.model('User', userShcema)

