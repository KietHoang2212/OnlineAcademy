/*
Update 11/1/2020 - 00:40
Hiện tại vẫn đang dùng biến tĩnh const lecturerID để lấy ID của lecturer đang đăng nhập
Code hơi lằng nhằng
*/
const fs = require( 'fs-extra' );
const express = require( 'express' );
const moment = require( 'moment' );
const router = express.Router();
const lecturerModel = require( '../models/lecturer.model' );
const courseModel = require( '../models/course.model' );
const lecturerCourseAuth = require( '../middlewares/lecturerCourseAuth' );
const upload = require( '../middlewares/upload.mdw' );
//const field

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
router.get( '/edit/:id', lecturerCourseAuth.auth( lecturerID ), async function ( req, res )
{
    const courseID = req.params.id;
    const course = await courseModel.single( courseID );
    const chapters = await courseModel.getCourseChapters( courseID );
    const lecturers = await courseModel.getLecturersOfCourse( courseID );
    const latestOncourseID = await courseModel.getLatestOncourseID();
    const latestChapterID = await courseModel.getLatestChapterID();
    //nếu lecturer có quản lý course này thì cho truy cập
    res.render( 'vwLecturers/edit', {
        course,
        lecturers,
        chapters,
        currentChapterID: +latestChapterID.latestChapterID,
        currentChapterNo: chapters.length,
        currentLecturerNo: +lecturers.length,
        currentOncourseID: +latestOncourseID.LatestOncourseID,
    } );
} );
router.post( '/edit/:id', lecturerCourseAuth.auth( lecturerID ), async function ( req, res )
{
    upload.any()( req, res, async function ( err )
    {
        // console.log( req.body.lecturers );
        const CourseID = req.params.id;
        //vứt lên database, courses, oncourse, chapters
        await courseModel.edit( req.body, CourseID );
        await courseModel.editChapters( req.body.chapters, CourseID );
        await courseModel.editOncourse( req.body.lecturers, CourseID );
        res.redirect( req.headers.referer || '/' );
    } );
} );
router.post( '/delete/:id', lecturerCourseAuth.auth( lecturerID ), async function ( req, res )
{
    console.log( req.params.id );
    const CourseID = req.params.id;
    const courseChapters = await courseModel.getCourseChapters( CourseID );
    //xử lý xóa Course có CourseID = req.body.id
    
    await courseModel.del( courseChapters, CourseID );

    res.redirect( req.headers.referer || '/' );
} );

//thêm khóa
router.get( '/add', async function ( req, res )
{
    // get biggest id, if null id = 1, else id = curID + 1
    const courseID = await courseModel.getLatestCourseID();
    const latestChapterID = await courseModel.getLatestChapterID();

    res.render( 'vwLecturers/add', {
        newCourseID: +courseID.latestCourseID + 1,
        currentChapterID: +latestChapterID.latestChapterID + 1,
        // static
        currentLecturer: lecturerID
    } );
} );

router.post( '/add', async function ( req, res )
{
    upload.any()( req, res, async function ( err )
    {
        await courseModel.add( req.body );
        await courseModel.addOncourse( req.body );
        await courseModel.addChapters( req.body );
        res.redirect( req.headers.referer || '/' );
    } );
} );

router.get( '/test', async function ( req, res )
{

   
    res.json( true );
} );

module.exports = router;;