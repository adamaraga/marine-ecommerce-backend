const mongoose = require("mongoose");
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "user"] },
  },
  { timestamps: true }
);

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", UserSchema);
