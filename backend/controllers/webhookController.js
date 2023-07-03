import { AppError } from "../utilis/appError.js";
import { stripeAPI } from "../utilis/stripe.js";

export const webHookHandlers = {
    "checkout.session.completed": (data) => {
    },

    "payment_intent.succeeded": (data) => {
    },
    "payment_intent.payment_failed": (data) => {
    },
};

export const webhook = (req, res, next) => {
    console.log("my name hook");

    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripeAPI.webhooks.constructEvent(
            req["rawBody"],
            sig,
            process.env.WEB_HOOK_SECRET
        );
    } catch (error) {
        return res.status(400).send(`webhook error ${error.message}`);
    }
    console.log("asas", event)
    if (webHookHandlers[event.type]) {
        webHookHandlers[event.type](event.data.object);
    }
};

export const webhookRetrive = async (
    req,
    res,
    next
) => {
    let session;
    try {
        session = await stripeAPI.checkout.sessions.retrieve(req.params.session_id);
        if (!session) {
            throw new AppError("there is a problem to retrive data", 400)
        }
    } catch (error) {
        console.log(error);
    }
    res.status(200).json({ session: session });
};
