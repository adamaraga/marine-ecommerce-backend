const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyName: { type: String },
    country: { type: String, required: true },
    streetAddress: { type: String, required: true },
    streetAddressOpt: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    addresstype: {
      type: String,
      required: true,
      enum: ["Billing", "Shipping", "Both"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
