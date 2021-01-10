const express = require( 'express' );
const moment = require( 'moment' );
const router = express.Router();
const lecturerModel = require( '../models/lecturer.model' );
const courseModel = require( '../models/course.model' );
const multer = require( 'multer' );
const categoryModel = require( '../models/category.model' );
const editAuth = require( '../middlewares/editAuth.mdw' );

//const field
const storage = multer.diskStorage( {
    destination: function ( req, file, callback )
    {
        let isnum = /^\d+$/.test( file.fieldname );
        if ( isnum )
            callback( null, './public/images' );
        else callback( null, './public/videos' );
    },
    filename: function ( req, file, callback )
    {
        let filename = file.fieldname;
        let isTail = false;
        for ( let i = 0; i < file.mimetype.length; i++ )
        {
            if ( isTail ) filename += file.mimetype[ i ];
            if ( file.mimetype[ i ] == '/' )
            {
                filename += '.';
                isTail = true;
            }
        }
        callback( null, filename );
    }
} );
const upload = multer( { storage } );
// lấy từ tài khoản đăng nhập? session?
const lecturerID = 1;

router.get( '/', async function ( req, res )
{
    // thông tin của lecturer
    res.redirect( '/lecturer/profile' );
} );
router.get( '/profile', async function ( req, res )
{
    const lecturer = await lecturerModel.single( lecturerID );
    if ( lecturer !== null )
        lecturer.l_DOB = moment( lecturer.l_DOB, 'DD/MM/YYYY' ).format( 'MM-DD-YYYY' );
    res.render( 'vwLecturers/profile', {
        lecturer
    } );
} );
router.post( '/profile', async function ( req, res )
{
    await lecturerModel.editProfileOfLecturer( req.body );
    //console.log(req.body)
    res.redirect( req.headers.referer );
} );
//các khóa của lecturer, còn thiếu phần xử lý ảnh của course
router.get( '/courses', async function ( req, res )
{
    const courses = await lecturerModel.getCoursesOfLecturer( lecturerID );

    for ( const course of courses )
    {
        //get students enrolled
        const ret = await courseModel.getCourseFeedback( course.CourseID );
        if ( ret === null )
        {
            course.totalStudents = 0;
            course.rating = 0.00;
        }
        else
        {
            course.totalStudents = ret.totalStudents;
            course.rating = ( +ret.totalStars / +ret.totalStudents ).toFixed( 2 );
        }
    }

    res.render( 'vwLecturers/courses', {
        courses
    } );
} );

//vào edit khóa này
router.get( '/edit/:id', editAuth.auth( lecturerID ), async function ( req, res )
{
    const courseID = req.params.id;
    const course = await courseModel.single( courseID );
    const chapters = await courseModel.getCourseChapters( courseID );
    const lecturers = await courseModel.getLecturersOfCourse( courseID );
    const latestOncourseID = await courseModel.getLatestOncourseID( courseID );
    const latestChapterID = await courseModel.getLatestChapterID();
    const categories = await categoryModel.all();
    let parentCategories = [];
    //console.log( latestChapterID );
    for ( const cat of categories )
    {
        if ( cat.CatParentID === null )
        {
            parentCategories[ `${ cat.CatID }` ] = {};
            parentCategories[ `${ cat.CatID }` ].CatName = cat.CatName;
        }
        else
        {
            parentCategories[ `${ cat.CatParentID }` ].children = parentCategories[ `${ cat.CatParentID }` ].children || [];
            parentCategories[ `${ cat.CatParentID }` ].children.push( { CatID: cat.CatID, CatName: cat.CatName } );
        }
    }
    //console.log(lecturers);
    //nếu lecturer có quản lý course này thì cho truy cập
    res.render( 'vwLecturers/edit', {
        parentCategories,
        course,
        lecturers,
        chapters,
        currentChapterID: +latestChapterID.latestChapterID,
        currentChapterNo: chapters.length,
        currentLecturerNo: +lecturers.length,
        currentOncourseID: +latestOncourseID.LatestOncourseID,
    } );
} );
router.post( '/edit/:id', async function ( req, res )
{
    upload.any()( req, res, async function ( err )
    {
        console.log( req.body.lecturers );
        const CourseID = req.params.id;
        //vứt lên database, courses, oncourse, chapters
        await courseModel.edit( req.body, CourseID );
        await courseModel.editChapters( req.body.chapters, CourseID );
        await courseModel.editOncourse( req.body.lecturers, CourseID );
        res.redirect( req.headers.referer || '/' );
    } );
} );
router.post( '/delete', async function ( req, res )
{
    const courseChapters = await courseModel.getCourseChapters( req.body.id );

    //xử lý xóa Course có CourseID = req.body.id
    await courseModel.del( courseChapters, req.body.id );
    res.redirect( req.headers.referer || '/' );
} );

//thêm khóa
router.get( '/add', async function ( req, res )
{
    // get biggest id, if null id = 1, else id = curID + 1
    const courseID = await courseModel.getLatestCourseID();
    const latestChapterID = await courseModel.getLatestChapterID();
    const categories = await categoryModel.all();
    let parentCategories = [];
    // xử lý cho Category cha và con, với châm ngôn, nhà là phải có nóc
    for ( const cat of categories )
    {
        if ( cat.CatParentID === null )
        {
            parentCategories[ `${ cat.CatID }` ] = {};
            parentCategories[ `${ cat.CatID }` ].CatName = cat.CatName;
        }
        else
        {
            parentCategories[ `${ cat.CatParentID }` ].children = parentCategories[ `${ cat.CatParentID }` ].children || [];
            parentCategories[ `${ cat.CatParentID }` ].children.push( { CatID: cat.CatID, CatName: cat.CatName } );
        }
    }
    console.log( courseID );
    res.render( 'vwLecturers/add', {
        newCourseID: +courseID.latestCourseID + 1,
        parentCategories,
        currentChapterID: +latestChapterID.latestChapterID + 1,
        // static
        currentLecturer: lecturerID
    } );
} );

router.post( '/add', async function ( req, res )
{
    upload.any()( req, res, async function ( err )
    {
        console.log( req.body );
        //vứt lên database, courses, oncourse, chapters
        await courseModel.add( req.body );
        await courseModel.addOncourse( req.body );
        await courseModel.addChapters( req.body );
        res.redirect( req.headers.referer || '/' );
    } );
} );

module.exports = router;;