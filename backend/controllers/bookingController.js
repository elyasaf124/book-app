import { Book } from '../models/bookModule.js'
import { User } from '../models/userModule.js'
import { AppError } from '../utilis/appError.js'
import { webOrigin } from '../app.js';
import { stripeAPI } from '../utilis/stripe.js';


//connect to stripe cli for work in dev mode!!!

export const createCheckOutSession = async (req, res, next) => {
    const { line_items } = req.body;
    if (!line_items) {
        return res.status(400).json({ error: "missing pram" });
    }
    let session;
    try {
        session = await stripeAPI.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items,
            customer_email: req.user.email,
            success_url: `${webOrigin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${webOrigin}/canceled`,
            shipping_address_collection: { allowed_countries: ["GB", "US"] },
        });
        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ error: "an error occured, unable to create session" });
    }
}

export const updateQuantityBooks = async (req, res, next) => {
    try {
        let user
        const books = req.body.books;
        if (!books) {
            throw new AppError("there is a problem", 400)
        }

        const filteredBooks = books?.filter(el => el.type._id && el.quantity);
        const booksIds = [].concat.apply([], filteredBooks?.map(el => ({ typeId: el.type._id, quantity: el.quantity })));
        for (const el of booksIds) {
            await Book.findByIdAndUpdate(el.typeId, { $inc: { quantity: -el.quantity } }, {
                new: true,
                runValidators: true
            });
        }

        if (booksIds.length > 0) {
            user = await User.findByIdAndUpdate(req.user._id, { $set: { myCart: [] } }, {
                new: true,
            });
        }


        res.status(200).json({
            status: "success",
            data: {
                msg: "books update",
                user
            }
        });

    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const addToCart = async (req, res, next) => {
    try {
        let book = req.user.myCart.find(el => {
            return el.type == req.body.bookId
        })
        if (book) {
            throw new AppError('This book is already in your cart', 400); // Throw an error using AppError class
        }
        const user = await User.findByIdAndUpdate(req.user._id, { myCart: [...req.user.myCart, { type: req.body.bookId, quantity: req.body.quantityBook }] }, { new: true })

        return res.status(200).json({
            status: "success",
            user
        });
    }
    catch (error) {
        console.log("error", error)
        next(error);
    }
}


export const updateCart = async (req, res, next) => {
    let myCart;
    myCart = req.body.updateCart.map(async (el) => {
        return {
            type: el.type._id,
            quantity: el.quantity
        };
    });

    Promise.all(myCart)
        .then(async (result) => {
            const updatedUser = await User.findByIdAndUpdate(req.user._id, {
                myCart: [...result]
            }, { new: true });

            res.status(200).json({
                status: 'success',
                data: {
                    user: updatedUser
                }
            });
        })
        .catch((error) => {
            res.status(500).json({
                status: 'error',
                message: 'Failed to update cart'
            });
        });
};

export const deleteItem = async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, { $pull: { myCart: { type: req.body.bookDelete._id } } },
        { new: true })


    res.status(200).json({
        status: 'success',
        user
    })
}

export const deleteAll = async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { myCart: null } })

    res.status(200).json({
        status: 'success'
    })
}

