const categoryModel = require( '../models/category.model' );
const courseModel = require( '../models/course.model' );
const moment = require( 'moment' );
const lecturerModel = require( '../models/lecturer.model' );
module.exports = function ( app )
{
	app.get( '/', async function ( req, res )
	{
		const courses = await courseModel.allWithDetails();
		const top10views = await courseModel.topViews( 10 );
		const top10new = await courseModel.topNewest( 10 );
		// console.log(cats);
		// console.log(req.isAuthenticated());
		res.render( 'home', {
			// cats,
			courses,
			top10views,
			top10new,
			empty: courses.length === 0
		} );
	} );

	app.get( '/course/:id', async function ( req, res )
	{
		const CourseID = req.params.id;
		const CourseChapters = await courseModel.getCourseChapters( CourseID );
		const CourseLecturers = await courseModel.getLecturersOfCourse( CourseID );
		for ( const lecturer of CourseLecturers )
		{
			lecturer.details = await lecturerModel.singleWithDetail( lecturer.l_ID );
			lecturer.details.l_DOB = moment( lecturer.details.l_DOB ).format( 'MM/DD/YYYY' );
		}
		const CourseData = await courseModel.singleWithDetail( CourseID );
		const StudentFeedback = await courseModel.getStudentFeedback( CourseID );
		const FiveRelevants = await courseModel.getCoursesByTotalStudents( CourseData.CatID, CourseID, 5 );

		console.log( CourseLecturers );

		res.render( 'course', {
			CourseData,
			CourseLecturers,
			CourseChapters,
			StudentFeedback,
			FiveRelevants
		} );
	} );

	app.use( '/lecturer', require( '../routes/lecturer.route' ) );
	//app.use( '/account', require( '../routes/front/account.route' ) );
	//app.use( '/lecturer/account', require( '../routes/front/lectureraccount.route' ) );
	//app.use( '/courses', require( '../routes/courses.route' ) );
	app.use( '/student', require( '../routes/student.route' ) );

};