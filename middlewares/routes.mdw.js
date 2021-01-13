const auth = require('./auth.mdw');
const categoryModel = require( '../models/category.model' );
const courseModel = require( '../models/course.model' );

module.exports = function ( app )
{
  app.get( '/', async function ( req, res )
  {
    const courses = await courseModel.allWithDetails();
<<<<<<< HEAD
    const top10views = await courseModel.topViews(10);
    const top10new = await courseModel.topNewest(10);
    console.log(cats);
    // console.log(req.isAuthenticated());
    res.render('home', {
      cats,
=======
    const top10views = await courseModel.top10Views();

    res.render( 'home', {
>>>>>>> b14655e42246593384a07d4095ca4f64eef882af
      courses,
      top10views,
      top10new,
      empty: courses.length === 0
    } );
  } );
  app.use( '/lecturer', require( '../routes/lecturer.route' ) );
  app.use('/account', require('../routes/front/account.route'));
  app.use('/lecturer/account', require('../routes/front/lectureraccount.route'));
};