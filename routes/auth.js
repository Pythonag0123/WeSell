const express = require("express");
const User = require("../models/User");
const passport = require("passport");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/register", async (req, res) => {
  try {
    let { username, name, email, phone, role, password, dob, gender } = req.body;
    let user = new User({ username, name, email, phone, role, dob, gender });
    await User.register(user, password); 
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.json({ message: "Error occurred" });
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req, res) => {
    req.flash("success", `Welcome ${req.user.name}`);
    if (req.user.role === "buyer") {
      return res.redirect("/shop");
    } else if (req.user.role === "seller") {
      return res.redirect("/dashboard");
    } else {
      return res.redirect("/");
    }
  }
);


module.exports = router;
