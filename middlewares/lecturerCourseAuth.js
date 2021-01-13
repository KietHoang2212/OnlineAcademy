const lecturerModel = require( '../models/lecturer.model' );
const courseModel = require( '../models/course.model' );



module.exports = {
    auth ( currentLecturer )
    {
        return async function ( req, res, next )
        {
            const CourseID = req.params.id;
            const lecturers = await courseModel.getLecturersOfCourse( CourseID );
            let accessible = false;
            for ( const lecturer of lecturers )
                if ( lecturer.l_ID === currentLecturer )
                {
                    accessible = true;
                    break;

                }
            if ( accessible === false )
                return res.redirect( '/lecturer/courses/' );
            next();
        };
    },
    // del ( currentLecturer )
    // {

    // }
};