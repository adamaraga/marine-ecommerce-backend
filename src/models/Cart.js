const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      img: { type: Buffer },
      name: { type: String, required: true },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
      price: { type: Number, required: true },
    },
    bill: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
