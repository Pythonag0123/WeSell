const express = require("express");
const isLoggedIn = require("../midllewares/isLoggedIn");
const Order = require("../models/Order"); 
const Product = require("../models/Product")
const Review = require("../models/Review"); 
const router = express.Router();

router.get("/", (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    console.log(error);
  }
});

router.get("/shop", (req, res) => {
  res.render("shop");
});

router.get("/dashboard", (req, res) => {
  res.render("admin/dashboard");
});

router.get("/orders", isLoggedIn, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).populate("product");
    const cartCount = req.user.cart ? req.user.cart.length : 0; 

    res.render("myorders", { orders, currentUser: req.user, cartCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/review/:productId", isLoggedIn, async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    console.log(comment)

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const review = new Review({
      product: productId,
      user: req.user._id,
      rating,
      comment
    });

    await review.save();

    res.json({ success: true, review });
  } catch (err) {
    console.error("Error posting review:", err);
    res.status(500).json({ error: "Failed to add review" });
  }
});

module.exports = router;
