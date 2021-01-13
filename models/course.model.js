const db = require( '../utils/db' );
const moment = require( 'moment' );
const fs = require( 'fs-extra' );
const TBL_COURSES = 'courses',
  TBL_ENROLLS = 'enrolls',
  TBL_CHAPTERS = 'chapters',
  TBL_ONCOURSE = 'oncourse',
  TBL_ENROLL_DETAILS = 'enrolldetails';

module.exports = {
  all ()
  {
    return db.load( `select * from ${ TBL_COURSES }` );
  },

  allWithDetails ()
  {
    const sql = `
    select table1.*, GROUP_CONCAT(table2.l_Name SEPARATOR ', ') as Lecturers
    from
    (select c.*, count(enrolls.EnrollID) as NumRate, round(avg(enrolls.Rate), 1) as Rate
    from courses c left join enrolls on c.CourseID = enrolls.CourseID
    group by c.CourseID) as table1
    inner join
    (select o.*, l.l_Name
    from oncourse o left join lecturers l
    on o.l_ID = l.l_ID) as table2
    on table1.CourseID = table2.CourseID
    group by table1.CourseID`;
    return db.load( sql );
  },
  async single ( CourseID )
  {
    const rows = await db.load( `select * from ${ TBL_COURSES } where CourseID = ${ CourseID }` );
    if ( rows.length === 0 ) return null;
    return rows[ 0 ];
  },
  async getCourseFeedback ( CourseID )
  {
    const sql = `select c.CourseID, count(en.s_ID) as totalStudents, sum(en.Rate) as totalStars
                    from courses c left join enrolls en on en.CourseID = c.CourseID
                    where c.CourseID = ${ CourseID }
                    group by c.CourseID, c.CourseName`;
    const ret = await db.load( sql );
    if ( ret.length === 0 ) return null;
    return ret[ 0 ];
  },
  async getLatestCourseID ()
  {
    const sql = `select max(courses.CourseID) as latestCourseID from courses`;
    const ret = await db.load( sql );
    if ( ret.length === 0 ) return null;
    return ret[ 0 ];
  },
  getCourseChapters ( CourseID )
  {
    const sql = `select * from ${ TBL_CHAPTERS } where CourseID = ${ CourseID } order by ChapterID`;
    return db.load( sql );
  },
  //huy's
  add ( data )
  {
    const entity = {
      CourseID: +data.courseID,
      CatID: +data.catID,
      CourseName: data.name,
      TinyDes: data.tinyDes,
      FullDes: data.fullDes,
      Price: +data.price || 0,
      PricePromotion: +data.pricePromotion || 0,
      LastUpdate: moment().format( 'YYYY-MM-DD' ),
      Active: data.active || 0,
      NumberSeen: 0,
    };
    //console.log( entity );
    return db.add( entity, TBL_COURSES );
  },
  async addOncourse ( data )
  {
    const lecturers = data.lecturers;
    for ( const lecturer of lecturers )
    {
      if ( lecturer.id === '' ) continue;
      const entity = {
        l_ID: lecturer.id,
        CourseID: data.courseID
      };
      //console.log( entity );
      await db.add( entity, TBL_ONCOURSE );
    }
  },
  async addChapters ( data )
  {
    const chapters = data.chapters;
    let i = 1;
    for ( const chapter of chapters )
    {
      if ( chapter.name === '' ) continue;
      const entity = {
        ChapterID: chapter.id,
        ChapterName: chapter.name,
        ChapterNo: i,
        CourseID: data.courseID
      };
      i++;
      await db.add( entity, TBL_CHAPTERS );
    }
  },
  async getLatestChapterOfCourse ( CourseID )
  {
    const sql = `select max(ChapterNo) as latestChapterNo from ${ TBL_CHAPTERS } where CourseID = ${ CourseID }`;
    const ret = await db.load( sql );
    if ( ret.length === 0 ) return null;
    return ret[ 0 ];
  },
  async getLatestChapterID ()
  {
    const sql = `select max(ChapterID) as latestChapterID from ${ TBL_CHAPTERS }`;
    const ret = await db.load( sql );
    if ( ret.length === 0 ) return null;
    return ret[ 0 ];
  },
  async del ( CourseChapters, CourseID )
  {
    const condition = {
      CourseID
    };
    await db.del( condition, TBL_COURSES );
    await db.del( condition, TBL_CHAPTERS );
    await db.del( condition, TBL_ONCOURSE );
    await db.del( condition, TBL_ENROLLS );
    for ( const chapter of CourseChapters )
    {
      const enrollDetailsCondition = {
        ChapterID: chapter.ChapterID
      };
      console.log( 'chapter = ' + chapter.ChapterID );
      await fs.remove( `./public/videos/video${ chapter.ChapterID }.mp4` );
      await db.del( enrollDetailsCondition, TBL_ENROLL_DETAILS );
    }
    await fs.remove( `./public/images/${ CourseID }.jpeg` );
    await fs.remove( `./public/images/${ CourseID }.jpeg` );
    //delete every course's chapter

  },
  async getLatestOncourseID ()
  {
    const sql = `select max(OnCourseID) as LatestOncourseID from ${ TBL_ONCOURSE } `;
    const ret = await db.load( sql );
    if ( ret.length === 0 ) return null;
    return ret[ 0 ];
  },
  getLecturersOfCourse ( CourseID )
  {
    const sql = `select * from ${ TBL_ONCOURSE } where CourseID = ${ CourseID } order by l_ID`;
    // console.log( sql );
    return db.load( sql );
  },
  async edit ( data, CourseID )
  {
    console.log( data );
    const courseCondition = {
      CourseID
    };
    const courseEntity = {
      CatID: +data.catID,
      CourseName: data.name,
      TinyDes: data.tinyDes,
      FullDes: data.fullDes,
      Price: +data.price || 0,
      PricePromotion: +data.pricePromotion || 0,
      LastUpdate: moment().format( 'YYYY-MM-DD' ),
      Active: data.active || 0,
    };
    await db.patch( courseEntity, courseCondition, TBL_COURSES );
  },
  async editOncourse ( Lecturers, CourseID )
  {
    for ( const lecturer of Lecturers )
    {
      console.log( lecturer );
      const oncourseCondition = {
        OnCourseID: lecturer.oncourseid,
      };
      const oncourseEntity = {
        OnCourseID: lecturer.oncourseid,
        CourseID,
        l_ID: lecturer.id,
      };
      const ret = await db.load( `select * from ${ TBL_ONCOURSE } 
                                        where OnCourseID=${ lecturer.oncourseid }` );

      if ( ret.length === 0 )
        await db.add( oncourseEntity, TBL_ONCOURSE );
      else
        await db.patch( oncourseEntity, oncourseCondition, TBL_ONCOURSE );
    }
  },
  async editChapters ( Chapters, CourseID )
  {
    for ( const chapter of Chapters )
    {
      const chapterCondition = {
        ChapterID: chapter.id,
      };
      const chapterEntity = {
        CourseID,
        ChapterNo: chapter.no,
        ChapterName: chapter.name,
      };

      const ret = await db.load( `select * from ${ TBL_CHAPTERS } where ChapterID = ${ chapter.id }` );
      if ( ret.length === 0 )
        await db.add( chapterEntity, TBL_CHAPTERS );
      else
        await db.patch( chapterEntity, chapterCondition, TBL_CHAPTERS );
    }
  },


  topViews(num){
    const sql = `
    select table1.*, GROUP_CONCAT(table2.l_Name SEPARATOR ', ') as Lecturers, s.CatName
    from
    (select c.*, count(enrolls.EnrollID) as NumRate, round(avg(enrolls.Rate), 1) as Rate
    from courses c left join enrolls on c.CourseID = enrolls.CourseID
    group by c.CourseID) as table1
    inner join
    (select o.*, l.l_Name
    from oncourse o left join lecturers l
    on o.l_ID = l.l_ID) as table2
    on table1.CourseID = table2.CourseID
    inner join categories s
    on table1.CatID = s.CatID
    group by table1.CourseID
    order by table1.NumberSeen desc
    limit ${ num }`;

    return db.load(sql);
  },

  topNewest(num){
    const sql = `
    select table1.*, GROUP_CONCAT(table2.l_Name SEPARATOR ', ') as Lecturers, s.CatName
    from
    (select c.*, count(enrolls.EnrollID) as NumRate, round(avg(enrolls.Rate), 1) as Rate
    from courses c left join enrolls on c.CourseID = enrolls.CourseID
    group by c.CourseID) as table1
    inner join
    (select o.*, l.l_Name
    from oncourse o left join lecturers l
    on o.l_ID = l.l_ID) as table2
    on table1.CourseID = table2.CourseID
    inner join categories s
    on table1.CatID = s.CatID
    group by table1.CourseID
    order by table1.LastUpdate desc
    limit ${ num }`;

    return db.load(sql);
  },

  async getByCatID(skip, limit, catID){
    const sql = `
    select table1.*, GROUP_CONCAT(table2.l_Name SEPARATOR ', ') as Lecturers, s.CatName
    from
    (select c.*, count(enrolls.EnrollID) as NumRate, round(avg(enrolls.Rate), 1) as Rate
    from courses c left join enrolls on c.CourseID = enrolls.CourseID
    group by c.CourseID) as table1
    inner join
    (select o.*, l.l_Name
    from oncourse o left join lecturers l
    on o.l_ID = l.l_ID) as table2
    on table1.CourseID = table2.CourseID
    inner join categories s
    on table1.CatID = s.CatID
    where table1.CatID = ${catID}
    group by table1.CourseID
    limit ${ skip }, ${limit} `;

    return db.load(sql);
  },

  async fulltextsearch(query, skip, limit, opt){
    let sql = `
    select tbl.*
    from
    ((select table2.*, GROUP_CONCAT(table3.l_Name SEPARATOR ', ') as Lecturers, s.CatName
    from
    (select table1.*, count(enrolls.EnrollID) as NumRate, avg(enrolls.Rate) as Rate
    from
    (select *
    from courses
    where
      match(CourseName)
        against('${query}')) as table1
    left join enrolls on table1.CourseID = enrolls.CourseID
    group by table1.CourseID) as table2
    inner join
    (select o.*, l.l_Name
    from oncourse o left join lecturers l
    on o.l_ID = l.l_ID) as table3
    on table2.CourseID = table3.CourseID
    inner join categories s
    on table2.CatID = s.CatID
    group by table2.CourseID)
    union
    (
    select table1_.*, GROUP_CONCAT(table2_.l_Name SEPARATOR ', ') as Lecturers, s_.CatName
    from
    (select c_.*, count(enrolls.EnrollID) as NumRate, avg(enrolls.Rate) as Rate
    from courses c_ left join enrolls on c_.CourseID = enrolls.CourseID
    group by c_.CourseID) as table1_
    inner join
    (select o_.*, l_.l_Name
    from oncourse o_ left join lecturers l_
    on o_.l_ID = l_.l_ID) as table2_
    on table1_.CourseID = table2_.CourseID
    inner join (select * from categories s1_ where match(s1_.CatName) against('${query}')) as s_
    on table1_.CatID = s_.CatID
    group by table1_.CourseID
    )) as tbl
    `;
    if (opt === 1){
      sql += 'order by tbl.Price asc ';
    }else if(opt === 2){
      sql += 'order by tbl.Rate desc ';
    }
    sql += `limit ${skip}, ${limit}`;
    return db.load(sql);
  }
  
};
