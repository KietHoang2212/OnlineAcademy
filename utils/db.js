const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
  host: 'remotemysql.com',
  port: 3306,
  user: 'iZpLn7NkfP',
  password: 'TMPQ5yj0Dq',
  database: 'iZpLn7NkfP',
  connectionLimit: 50,
});

// const pool = mysql.createPool({
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: 'anhkiet2212',
//   database: 'online_courses',
//   connectionLimit: 50,
// });
// make pool.query() a promise
const pool_query = util.promisify(pool.query).bind(pool);

module.exports = {
  load: sql => pool_query(sql),
  add: (entity, tableName) => pool_query(`insert into ${tableName} set ?`, entity),
  del: (condition, tableName) => pool_query(`delete from ${tableName} where ?`, condition),
  patch: (entity, condition, tableName) => pool_query(`update ${tableName} set ? where ?`, [entity, condition])
};
