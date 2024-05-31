const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ProductSchema = new mongoose.Schema(
  {
    img: [{ type: Buffer }],
    name: { type: String, required: true },
    discription: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    weight: { type: Number },
    bestSeller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", ProductSchema);
