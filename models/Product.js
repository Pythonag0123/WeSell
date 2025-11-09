const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  file: { type: String, required: true },

  // owner reference
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", // seller model
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
