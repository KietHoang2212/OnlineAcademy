const express = require('express');
const courseModel = require('../models/course.model');
const categoryModel = require('../models/category.model');
const { json } = require('express');

const router = express.Router();

router.get('/byCat/:id', async function (req, res) {
    const catID = req.params.id;
    const page = +req.query.page || 1;

    const limit = 4;
    const skip = limit*(page-1);
    
    

    const courses = await courseModel.getByCatID(skip, limit, catID);
    const fullCourses = await courseModel.getByCatID(0, 1000000007, catID);
    const cat = await categoryModel.single(catID);
    res.render('vwCourses/byCat', {
        cat,
        courses,
        isEmpty: courses.length === 0,
        page,
        maxpage: Math.floor(fullCourses.length/limit) + 1,
    })
})




module.exports = router;