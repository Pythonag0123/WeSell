const isSeller = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You need to login first");
        return res.redirect("/login");
    }

    if (req.user.role !== "seller") {
        req.flash("error", "You are not authorized to perform this action");
        return res.redirect("back"); 
    }

    next();
};

module.exports = isSeller;
