const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(401).json({ error: "You need to login first" });
    }
    req.flash('error', 'You need to login first');
    return res.redirect('/login');
  }
  next();
};

module.exports = isLoggedIn;
