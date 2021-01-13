const db = require( '../utils/db' );
const moment = require( 'moment' );
const TBL_LECTURERS = 'lecturers',
    TBL_ONCOURSE = 'onCourse',
    TBL = 'lecturers',
    TBL_COURSES = 'courses';
//l stands for lecturer
module.exports = {
    all ()
    {
        return db.load( `select * from ${ TBL_LECTURERS }` );
    },
    async single ( l_ID )
    {
        const rows = await db.load( `select * from ${ TBL_LECTURERS } where l_ID = ${ l_ID }` );
        if ( rows.length === 0 ) return null;
        return rows[ 0 ];
    },
    getCoursesOfLecturer ( l_ID )
    {
        const sql = `select c.*
                    from lecturers lec left join oncourse onc on lec.l_ID = onc.l_ID 
                    left join courses c on onc.CourseID = c.CourseID
                    where lec.l_ID = ${ l_ID }`;
        return db.load( sql );
    },
    editProfileOfLecturer ( data )
    {
        const condition = { l_ID: data.id };
        const entity = {
            l_Name: data.name,
            l_Email: data.email,
            l_DOB: moment( data.dob, 'MM/DD/YYYY' ).format( 'YYYY-MM-DD' ),
            l_Occupation: data.occupation,
            l_Description: data.description
        };
        return db.patch( entity, condition, TBL_LECTURERS );
    },

    async singleByUserName(username) {
        const rows = await db.load(`select * from ${TBL} where l_Username = '${username}'`);
        if (rows.length === 0)
          return null;
    
        return rows[0];
      },
    
      async singleByEmail(email) {
        const rows = await db.load(`select * from ${TBL} where l_Email = '${email}'`);
        if (rows.length === 0)
          return null;
    
        return rows[0];
      },
    
      add(entity) {
        return db.add(entity, TBL)
      },
    
      update(entity, id) {
        const condition = { l_ID: id };
        delete entity.l_ID;
        return db.patch(entity, condition, TBL);
      },
};