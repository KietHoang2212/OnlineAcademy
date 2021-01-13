const db = require( '../utils/db' );

const TBL_CATEGORIES = 'categories';

module.exports = {
  all ()
  {
    return db.load( `select * from ${ TBL_CATEGORIES }` );
  },

  allChild ( id )
  {
    const sql = `
      select *
      from categories c
      where c.CatParentID = ${ id }
    `;
    return db.load( sql );
  },
  //huy's
  add ( entity )
  {
    return db.add( entity, TBL_CATEGORIES );
  },
  async single ( id )
  {
    const rows = await db.load( `select * from ${ TBL_CATEGORIES } where CatID = ${ id }` );
    if ( rows.length === 0 )
      return null;

    return rows[ 0 ];
  },
  del ( entity )
  {
    const condition = { CatID: entity.CatID };
    return db.del( condition, TBL_CATEGORIES );
  },
  patch ( data )
  {
    const condition = { CatID: data.CatID },
      entity = { CatName: data.CatName };
    return db.patch( data, condition, TBL_CATEGORIES );
  },
  
  async single ( CatID )
  {
    const rows = await db.load( `select * from ${ TBL_CATEGORIES} where CatID = ${ CatID }` );
    if ( rows.length === 0 ) return null;
    return rows[ 0 ];
  },
};
