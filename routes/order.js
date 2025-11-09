const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const isLoggedIn = require("../midllewares/isLoggedIn");

router.post("/order", isLoggedIn, async (req, res) => {
  try {
    const { productId, quantity, name, email, phone, pincode, address } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.quantity < quantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    const totalPrice = product.price * quantity;

    const order = new Order({
      buyer: req.user._id,
      product: product._id,
      quantity,
      totalPrice,
      shippingDetails: { name, email, phone, pincode, address }
    });

    await order.save();

    product.quantity -= quantity;
    await product.save();

    res.json({ success: true, message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 Cart Checkout Order
router.post("/order-cart", isLoggedIn, async (req, res) => {
  try {
    const { cart, shippingDetails } = req.body;
    if (!cart || cart.length === 0) return res.status(400).json({ error: "Cart is empty" });

    let orders = [];

    for (const item of cart) {
      const product = await Product.findById(item._id);
      if (!product) continue;

      if (product.quantity < item.qty) {
        return res.status(400).json({ error: `Not enough stock for ${product.name}` });
      }

      const order = new Order({
        buyer: req.user._id,
        product: product._id,
        quantity: item.qty,
        totalPrice: product.price * item.qty,
        shippingDetails
      });

      await order.save();
      orders.push(order);

      // reduce stock
      product.quantity -= item.qty;
      await product.save();
    }

    res.json({ success: true, message: "Cart checkout successful", orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/orders", isLoggedIn, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).populate("product");
    res.render("orders", { orders }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
