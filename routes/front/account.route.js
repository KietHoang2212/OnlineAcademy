const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const userModel = require('../../models/students.model');
const lecturerModel = require('../../models/lecturer.model');
const adminModel = require('../../models/admin.model');
const auth = require('../../middlewares/auth.mdw');



var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');

passport.serializeUser(function(user, done) {
  // console.log(user[0].s_id);
  // console.log(user[0].l_id);
  // console.log(user);
  // console.log(user.l_Username);
  // console.log(user.s_Username);
  // console.log(user.s_id);
  // console.log(user.l_id);
  if (user.s_Username !== undefined)
    done(null, { id: user.s_ID, type: 'Student' });
  else if (user.l_Username !== undefined)
    done(null, { id: user.l_ID, type: 'Lecturer' });
  else if (user.a_Username !== undefined)
    done(null, { id: user.a_ID, type: 'Admin' });
});

passport.deserializeUser(function(obj, done) {
  console.log(obj);
  if (obj.type === 'Student'){
    // console.log('sss');
    userModel.single(obj.id).then(function (user) {
          done(null, user);
      }).catch(function (err) {
          console.log(err);
      })
  }else if (obj.type === 'Lecturer'){
    lecturerModel.single(obj.id).then(function (user) {
          done(null, user);
      }).catch(function (err) {
          console.log(err);
      })
  }else if (obj.type === 'Admin'){
    adminModel.single(obj.id).then(function (user) {
        done(null, user);
    }).catch(function (err) {
        console.log(err);
    })
  }
});

passport.use('student', new LocalStrategy(
  function (username,password,done) {
    userModel.singleByUserName(username).then(function (user) {
          bcrypt.compare(password, user.s_Password, function (err,result) {
              if (err) { return done(err); }
              if(!result) {
                  return done(null, false, { message: 'Incorrect username and password' });
              }
              console.log(user.s_IsActive);
              if (user.s_IsActive === 0){
                console.log('LOCK');
                return done(null, false, { message: 'Your Account has been locked' });
              }
              console.log(password);
              return done(null, user);
          })
      }).catch(function (err) {
          return done(err);
      })
  }
))

const router = express.Router();

router.get('/login', async function (req, res) {
  if (req.headers.referer) {
    req.session.retUrl = req.headers.referer;
  }

  res.render('vwAccount/login', {
    layout: false
  });
})

// router.post('/login', async function (req, res) {
//   const user = await userModel.singleByUserName(req.body.username);

//   if (user === null) {
//     return res.render('vwAccount/login', {
//       layout: false,
//       err_message: 'Invalid username or password.'
//     });
//   }

//   const ret = bcrypt.compareSync(req.body.password, user.s_Password);
//   if (ret === false) {
//     return res.render('vwAccount/login', {
//       layout: false,
//       err_message: 'Invalid username or password.'
//     });
//   }

//   req.session.isAuth = true;
//   req.session.authUser = user;
//   // req.session.cart = [];

//   let url = req.session.retUrl || '/';
//   res.redirect(url);
// })

// router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),
// function(req, res) {
//   let url = req.session.retUrl || '/';
//   console.log(url);
//   res.redirect(url);
// }),

router.post('/login', async function(req, res, next) {
  passport.authenticate('student', function(err, user, info) {
    if (err) { return res.render('vwAccount/login', {layout: false, err_message: 'Invalid username or password1.'});  }
    if (!user) { return res.render('vwAccount/login', {layout: false, err_message: info.message}); }
    req.login(user, function(err) {
      if (err) { return res.render('vwAccount/login', {layout: false, err_message: 'Invalid username or password3.'});  }

        req.session.role = 'student';
        let url = req.session.retUrl || '/';
        res.redirect(url);
    });
  })(req, res, next);
}),


router.post('/logout', async function (req, res) {
  req.logout();
  req.session.isAuth = false;
  req.session.authUser = null;
  req.session.role = null;
  req.session.cart = [];
  res.redirect(req.headers.referer);
})

router.get('/register', async function (req, res) {
  res.render('vwAccount/register');
})

router.post('/register', async function (req, res) {
  const hash = bcrypt.hashSync(req.body.password, 10);
  const dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
  const user = {
    s_Username: req.body.username,
    s_Password: hash,
    s_DOB: dob,
    s_Name: req.body.name,
    s_Email: req.body.email,
    s_IsActive: '1',
    // permission: 0
  }

  const nodemailer = require("nodemailer");
  let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
        user: 'colabfree2001@gmail.com',			//email ID
        pass: 'anhkiet2212'				//Password 
      }
  });

  console.log(req.body.username);
  console.log(bcrypt.hashSync(req.body.username, 10));
  const secret = bcrypt.hashSync(req.body.username, 10);
  transporter.sendMail({
    from: '"OnlineCourse 👻" colabfree2001@gmail.com', // sender address
    to: req.body.email, // list of receivers
    subject: "Activate your account ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<p>Click <a href="http://localhost:3000/account/activate?key=${secret}&s_Username=${user.s_Username}&s_Password=${user.s_Password}&s_DOB=${user.s_DOB}&s_Name=${user.s_Name}&s_Email=${user.s_Email}">here</a> to active</p>`,
    // html: `<a>localhost:3000/account/activate?key=${secret}&s_Username=${user.s_Username}&s_Password=${user.s_Password}&s_DOB=${user.s_DOB}&s_Name=${user.s_Name}&s_Email=${user.s_Email}</a>`, // html body
  });

  // console.log("Message sent: %s", info.messageId);
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // await userModel.add(user);
  // res.render('vwAccount/login');
  res.redirect('/account/login');
})

router.get('/activate', async function (req, res) {
  const secret = req.query.key;
  const user = {
    s_Username: req.query.s_Username,
    s_Password: req.query.s_Password,
    s_DOB: req.query.s_DOB,
    s_Name: req.query.s_Name,
    s_Email: req.query.s_Email,
    s_IsActive: '1',
    // permission: 0
  }

  
  let isActive = bcrypt.compareSync(user.s_Username, secret);
  if (isActive){
    await userModel.add(user);
    return res.json(true);}

  res.json(false);
})

router.get('/is-available', async function (req, res) {
  const username = req.query.user;
  const email = req.query.email;
  const user1 = await userModel.singleByUserName(username);
  const user2 = await userModel.singleByEmail(email);
  if (user1 === null && user2 === null) {
    return res.json(true);
  }

  res.json(false);
})

router.get('/profile', auth, async function (req, res) {
  let userInfo = req.user;
  if ( userInfo !== null )
    userInfo.s_DOB = moment( userInfo.s_DOB, 'DD/MM/YYYY' ).format( 'MM/DD/YYYY' );
  console.log(userInfo);
  res.render('vwAccount/profile', {
    userInfo,
  });
})

router.post('/profile', auth, async function (req, res) {
  // const hash = bcrypt.hashSync(req.body.password, 10);
  const dob = moment(req.body.dob, 'MM/DD/YYYY').format('YYYY-MM-DD');
  // let user = req.user;

  const user = {
    // s_Username: req.body.username,
    // s_Password: hash,
    s_DOB: dob,
    s_Name: req.body.name,
    s_Email: req.body.email,
    // permission: 0
  }
  console.log(user);

  await userModel.update(user, req.user.s_ID);
  res.redirect('/account/profile');
})

router.get('/change-password',auth, async function (req, res) {
  res.render('vwAccount/change-password', {
    layout: false
  });
})


router.post('/change-password', auth, async function (req, res){
  if (!bcrypt.compareSync(req.body.oldpassword, req.user.s_Password)){
    return res.render('vwAccount/change-password', {layout: false, err_message: 'Wrong old password!!!'});
  }
  if (req.body.newpassword !== req.body.confirmpassword){
    return res.render('vwAccount/change-password', {layout: false, err_message: 'Confirm Password not match!!!'});
  }
  const user = {
    s_Password: bcrypt.hashSync(req.body.newpassword, 10),
  }
  await userModel.update(user, req.user.s_ID);
  req.logout();
  res.redirect('/account/login');
})

module.exports = router;