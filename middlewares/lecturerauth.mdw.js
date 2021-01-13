module.exports = function auth(req, res, next) {
    console.log(req.isAuthenticated() === false);
    if (req.isAuthenticated() === false || req.session.role !== 'lecturer') {
      req.session.retUrl = req.originalUrl;
      return res.redirect('lecturer/account/login');
    }
  
    next();
  }