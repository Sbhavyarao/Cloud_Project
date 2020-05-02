var express = require('express');
var router = express.Router();
const cors = require('cors');

router.use(cors());
var User = require('../models/User');
var Courses = require('../models/Courses');
var code = require('../models/attendCode');
var email 	= require("emailjs/email");
var nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'bhavyasrirao@gmail.com',
        pass: '5star450gvrao',
    },
});


router.get('/getSyllabusByUserId/:userId', function (req, res, next) {
    console.log('Get request for syllabus');
    syllabus.find({userId: req.params.userId})
        .exec(function (err, syllabus) {
            if(err){
                console.log("Error retrieving syllabus");
            }else {
                res.json(syllabus);
            }
        })
});
router.post('/syllabus', function (req, res, next) {
    console.log('Request', req.body);
    const userSyllabus = {
        userId:req.body.userID,
        Syllabus:req.body.syllabusArray
    }
    syllabus.create(userSyllabus, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });

});

router.post('/login', function (req, res, next) {
    User.findOne({email: req.body.email}).then(user =>{
        if (user) {
            if(req.body.password === user.password){
                res.json(user);
            }
            else{
                res.send('password does not match')
            }
        }
        else {
            res.send('User does not exist')
        }
    }).catch(err => {
        res.send('error: ' + err)
    })
});

router.post('/saveCode', function (req, res, next) {
    code.findOne({email: req.body.email}).then(user =>{
        if (user) {
            if(req.body.password === user.password){
                res.json(user);
            }
            else{
                res.send('password does not match')
            }
        }
        else {
            res.send('User does not exist')
        }
    }).catch(err => {
        res.send('error: ' + err)
    })
});


router.put('/updateProfile', function(req, res, next){
    User.findByIdAndUpdate(req.body._id, req.body, function (err,post){
        if (err) return next(err);
        res.json(post);
    })
})
router.post('/register', function (req, res, next) {
    /*const mailOptions = {
        from: 'bhavyasrirao@gmail.com',
        to: 'nadimpelli.mani@gmail.com',
        subject: 'Welcome to Smart Learn',
        html: 'Thanks you for registering',
    };*/

    /*transport.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
    }
    console.log(info);
    });*/
    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.emailId,
        password: req.body.password,
        typeOfUser: req.body.typeOfUser
    }
    User.create(userData, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
