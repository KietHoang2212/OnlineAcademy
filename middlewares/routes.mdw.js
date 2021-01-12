// const auth = require('./auth.mdw');
const categoryModel = require( '../models/category.model' );
const courseModel = require( '../models/course.model' );

module.exports = function ( app )
{
  app.get( '/', async function ( req, res )
  {
    const courses = await courseModel.allWithDetails();
    const top10views = await courseModel.top10Views();

    res.render( 'home', {
      courses,
      top10views,
      empty: courses.length === 0
    } );
  } );
  app.use( '/lecturer', require( '../routes/lecturer.route' ) );
};