const db = require('../utils/db');

const TBL = 'students';

module.exports = {
  all() {
    return db.load(`select * from ${TBL}`);
  },

  async single(id) {
    const rows = await db.load(`select * from ${TBL} where s_ID = ${id}`);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  async singleByUserName(username) {
    const rows = await db.load(`select * from ${TBL} where s_Username = '${username}'`);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  async singleByEmail(email) {
    const rows = await db.load(`select * from ${TBL} where s_Email = '${email}'`);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  add(entity) {
    return db.add(entity, TBL)
  },

  update(entity, id) {
    const condition = { s_ID: id };
    delete entity.s_ID;
    return db.patch(entity, condition, TBL);
  },
};
