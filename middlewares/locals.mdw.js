const categoryModel = require( '../models/category.model' );

module.exports = function ( app )
{
  // sử dụng res.locals cho tiện sử dụng, rút gọn lại code
  app.use( async function ( req, res, next )
  {
    const parent_cats = await categoryModel.allChild( 0 );
    let cats = [];
    for ( let i = 0; i < parent_cats.length; ++i )
    {
      let cat = {};
      cat[ 'parent' ] = parent_cats[ i ];
      id = +parent_cats[ i ].CatID;
      cat[ 'children' ] = await categoryModel.allChild( id );
      cats.push( cat );
    }
    res.locals.lcCategories = cats;

    next();
  } );
};
