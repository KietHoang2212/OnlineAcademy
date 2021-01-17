const auth = require('./auth.mdw');
const categoryModel = require( '../models/category.model' );
const courseModel = require( '../models/course.model' );

module.exports = function ( app )
{
  app.get( '/', async function ( req, res )
  {
    const courses = await courseModel.allWithDetails();
    const top10views = await courseModel.topViews(10);
    const top10new = await courseModel.topNewest(10);
    const hotCourses = await courseModel.hotCourses();
    const hotCat = await categoryModel.hotCat();
    // console.log(cats);
    // console.log(req.isAuthenticated());
    res.render('home', {
      // cats,
      courses,
      top10views,
      top10new,
      hotCourses,
      hotCat,
      empty: courses.length === 0
    } );
  } );
  app.use( '/lecturer', require( '../routes/lecturer.route' ) );
  app.use('/account', require('../routes/front/account.route'));
  app.use('/lecturer/account', require('../routes/front/lectureraccount.route'));
  app.use('/courses', require('../routes/courses.route'));
  app.use('/admin/account', require('../routes/front/adminaccount.route'));
  app.use('/admin', require('../routes/front/admin.route'));
};