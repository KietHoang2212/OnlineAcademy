module.exports = function auth(req, res, next) {
    console.log(req.isAuthenticated() === false);
    if (req.isAuthenticated() === false || req.session.role !== 'student') {
      req.session.retUrl = req.originalUrl;
      return res.redirect('/account/login');
    }
  
    next();
  }