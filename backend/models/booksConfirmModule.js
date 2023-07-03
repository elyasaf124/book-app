import mongoose from "mongoose";

const booksConfirmShcema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "book must have a name"],
    minlength: [2],
  },
  author: {
    type: String,
    minlength: [2],
  },
  categories: [
    {
      type: String,
    },
  ],
  year: {
    type: Number,
  },
  language: {
    type: String,
  },
  extension: {
    type: String,
  },
  image: {
    type: Object,
  },
  pages: {
    type: Number,
  },
  description: {
    type: String,
    minlength: [30, "description must include at least 30 words"],
  },
  rate: {
    type: Number,
    min: [1, "Rating must be above 1.0"],
    max: [5, "Rating must be below 5.0"],
  },
  uploadBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  price: { type: Number },
  priceSale: { type: Number },
  quantity: {
    type: Number,
    min: [0],
  },
});

export const BookConfirm = mongoose.model("BookConfirm", booksConfirmShcema);
