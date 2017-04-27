/**
  Prevents people from accessing protected pages when they're not signed in
 */
module.exports = (req, res, next) => {
  if (!req.user) {
    req.flash('error', 'Please sign in to access this page.');
    res.redirect('/keystone/signin');
  } else {
    next();
  }
};
