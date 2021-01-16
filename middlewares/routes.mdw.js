const courseModel = require( '../models/course.model' );
const moment = require( 'moment' );
const lecturerModel = require( '../models/lecturer.model' );
const studentModel = require( '../models/students.model' );
const studentAuth = require( '../middlewares/auth.mdw' );
const lecturerAuth = require( '../middlewares/lecturerauth.mdw' );

module.exports = function ( app )
{
	app.get( '/', async function ( req, res )
	{
		//const courses = await courseModel.allWithDetails();
		const top10views = await courseModel.topViews( 10 );
		const top10new = await courseModel.topNewest( 10 );

		res.render( 'home', {
			top10views,
			top10new,
		} );
	} );

	app.get( '/course/:id', async function ( req, res )
	{
		const CourseID = req.params.id;
		await courseModel.increaseNumberSeen( CourseID );
		const CourseChapters = await courseModel.getCourseChapters( CourseID );
		const CourseLecturers = await courseModel.getLecturersOfCourse( CourseID );
		for ( const lecturer of CourseLecturers )
			lecturer.details = await lecturerModel.singleWithDetail( lecturer.l_ID );
		const CourseData = await courseModel.singleWithDetail( CourseID );
		const StudentFeedback = await courseModel.getStudentFeedback( CourseID );
		const FiveRelevants = await courseModel.getCoursesByTotalStudents( CourseData.CatID, CourseID, 5 );
		const CurrentUser = req.user;
		if ( typeof ( CurrentUser ) !== 'undefined' )
		{
			CurrentUser.role = req.session.role;
			//console.log( CurrentUser.role );
		}
		let Enrollment, Favorite;
		if ( typeof ( CurrentUser ) !== 'undefined' && req.session.role === 'student' )
		{
			Favorite = await studentModel.getFavorite( CurrentUser.s_ID, CourseID );
			//console.log( Favorite );
			Enrollment = await studentModel.getEnroll( CurrentUser.s_ID, CourseID );
		}
		let RateStat = new Array( 5 ).fill( 0 );
		for ( const fb of StudentFeedback )
			RateStat[ fb.Rate - 1 ] += 100 * ( 1 / StudentFeedback.length );
		for ( const fb of StudentFeedback )
			RateStat[ fb.Rate - 1 ] = Math.round( RateStat[ fb.Rate - 1 ] );

		//console.log( RateStat );
		res.render( 'course', {
			CourseData,
			CourseLecturers,
			CourseChapters,
			StudentFeedback,
			RateStat,
			FiveRelevants,
			CurrentUser,
			Enrollment,
			Favorite,
		} );
	} );
	
	app.use( '/lecturer/account', require( '../routes/front/lectureraccount.route' ) );
	app.use( '/account', require( '../routes/front/account.route' ) );
	app.use( '/courses', require( '../routes/courses.route' ) );
	app.use( '/lecturer', lecturerAuth, require( '../routes/lecturer.route' ) );
	app.use( '/student', studentAuth, require( '../routes/student.route' ) );
};