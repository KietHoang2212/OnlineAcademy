// const auth = require('./auth.mdw');
const categoryModel = require( '../models/category.model' );
const courseModel = require( '../models/course.model' );

module.exports = function ( app )
{
  app.get( '/', async function ( req, res )
  {
    const parent_cats = await categoryModel.allChild( 0 );
    let cats = [];
    for ( let i = 0; i < parent_cats.length; ++i )
    {
      let cat = {};
      cat[ 'parent' ] = parent_cats[ i ];
      id = +parent_cats[ i ].CatID;
      cat[ 'child' ] = await categoryModel.allChild( id );
      cats.push( cat );
    }

    // const courses = await courseModel.all();
    const courses = await courseModel.allWithDetails();
    const top10views = await courseModel.top10Views();
    console.log(courses);
    res.render('home', {
      cats,
      courses,
      top10views,
      empty: courses.length === 0
    } );
  } );
  app.use( '/lecturer', require( '../routes/lecturer.route' ) );
};