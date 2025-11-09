const express=require("express")
const router=express.Router()
const jwt=require('jsonwebtoken')
const bcrypt=require("bcryptjs")
const isSeller = require("../midllewares/isSeller")
const upload = require("../midllewares/multer");
const Product = require("../models/Product")
const isLoggedIn = require("../midllewares/isLoggedIn")
router.use(express.json())

router.get("/admin", isSeller, (req, res) => {
  try {
    res.render("admin/dashboard", { page: "home" }); 
  } catch (error) {
    console.log(error);
  }
});

router.get("/admin/logout",isSeller,(req,res)=>{
    req.logout(()=>{
        req.flash('success' , 'Logged out successfully')
        res.redirect('/login');
    });
})
router.get("/logout",isLoggedIn,(req,res)=>{
    req.logout(()=>{
        req.flash('success' , 'Logged out successfully')
        res.redirect('/login');
    });
})

router.post("/admin/create-product", isSeller, upload.single("file"), async (req, res) => {
  try {
    const data = req.body;
    const file = req.file;

    const newProduct = await Product.create({
      name: data.name,
      price: data.price,
      category: data.category,
      quantity: data.quantity,
      description: data.description,
      file: file.path,
      owner: req.user.id 
    });

    console.log("Product created:", newProduct);
    res.redirect("/admin");
  } catch (error) {
    console.log(error);
    res.redirect("/admin");
  }
});


router.get("/products",async(req,res)=>{
    const data = await Product.find({});
    res.json(data)
})

router.get("/products/mine", isSeller, async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user.id }); 
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});
 

router.delete("/delete-item/:id", isSeller, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findOneAndDelete({ _id: id, owner: req.user.id });

    if (!deleted) return res.status(404).json({ error: "Product not found or not yours" });

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Edit product
router.put("/products/edit/:id", isSeller, upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description
    };

    if (req.file) updateData.file = req.file.path;

    const updated = await Product.findOneAndUpdate(
      { _id: id, owner: req.user.id }, // <--- ensure owner match
      updateData,
      { new: true }
    );

    if (!updated) return res.status(404).send("Product not found or not yours");

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update product");
  }
});

const Order = require("../models/Order")

router.get("/orders/mine", isSeller, async (req, res) => {
  try {
    const sellerProducts = await Product.find({ owner: req.user._id }).select("_id");
    const orders = await Order.find({ product: { $in: sellerProducts } })
      .populate("product buyer");

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.put("/orders/update/:id", isSeller, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id).populate("product");

    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to update this order" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
});


module.exports = router;