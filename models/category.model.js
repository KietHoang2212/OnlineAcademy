const db = require('../utils/db');

const TBL_CATEGORIES = 'categories';

module.exports = {
  all() {
    return db.load(`select * from ${TBL_CATEGORIES}`);
  },

  allChild(id) {
    const sql = `
      select *
      from categories c
      where c.CatParentID = ${id}
    `;
    return db.load(sql);
  }
};
