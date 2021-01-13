// const cartModel = require('../models/cart.model');
const categoryModel = require('../models/category.model');

module.exports = function (app) {
  app.use(async function (req, res, next) {
    // if (typeof (req.session.isAuth) === 'undefined') {
    //   req.session.isAuth = false;
    //   req.session.cart = [];
    // }

    res.locals.isAuth = req.isAuthenticated()
    res.locals.authUser = req.user;
    res.locals.isStudent = (req.session.role === 'student');
    res.locals.isLecturer = (req.session.role === 'lecturer');
    res.locals.isAdmin = (req.session.role === 'admin');
    // res.locals.cartSummary = cartModel.getNumberOfItems(req.session.cart)
    next();
  })

  // app.use(async function (req, res, next) {
  //   const rows = await categoryModel.allWithDetails();
  //   res.locals.lcCategories = rows;
  //   next();
  // })
}