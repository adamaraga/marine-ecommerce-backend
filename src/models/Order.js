const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        img: { type: Buffer },
        name: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: Number,
      },
    ],
    bill: {
      type: Number,
      required: true,
      default: 0,
    },
    billingAddress: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Address",
    },
    shippingAddress: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Address",
    },
    paymentMethod: { type: String },
    paymentId: { type: String },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["Initiated", "Success", "Failed"],
    },
    orderNote: { type: String },
  },
  { timestamps: true }
);

OrderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Order", OrderSchema);
