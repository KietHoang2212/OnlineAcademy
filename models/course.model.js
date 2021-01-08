const db = require('../utils/db');

const TBL_CATEGORIES = 'courses';

module.exports = {
  all() {
    return db.load(`select * from ${TBL_CATEGORIES}`);
  },

  allWithDetails() {
    const sql = `
    select table1.*, GROUP_CONCAT(table2.l_Name SEPARATOR ', ') as Lecturers
    from
    (select c.*, count(enrolls.EnrollID) as NumRate, avg(enrolls.Rate) as Rate
    from courses c left join enrolls on c.CourseID = enrolls.CourseID
    group by c.CourseID) as table1
    inner join
    (select o.*, l.l_Name
    from oncourse o left join lecturers l
    on o.l_ID = l.l_ID) as table2
    on table1.CourseID = table2.CourseID
    group by table1.CourseID`;

    return db.load(sql);
  }
};
