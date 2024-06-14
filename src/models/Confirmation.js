const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const Schema = mongoose.Schema;

const ConfirmationSchema = new mongoose.Schema(
  {
    token: {
      type: Schema.Types.UUID,
      required: true,
      default: () => randomUUID(),
    },
    type: {
      type: String,
      required: true,
      enum: ["email-validation", "reset-password"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Confirmation", ConfirmationSchema);
