const express = require( 'express' );
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');

require( 'express-async-errors' );



const app = express();

app.use( express.urlencoded( {
  extended: true
} ) );

app.use( '/public', express.static( 'public' ) );
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


require( './middlewares/view.mdw' )( app );
<<<<<<< HEAD
// require('./middlewares/session.mdw')(app);
require('./middlewares/locals.mdw')(app);
=======
require( './middlewares/session.mdw' )( app );
require( './middlewares/locals.mdw' )( app );
>>>>>>> b14655e42246593384a07d4095ca4f64eef882af
require( './middlewares/routes.mdw' )( app );
require( './middlewares/error.mdw' )( app );


const PORT = 3000;
app.listen( PORT, function ()
{
  console.log( `Example app listening at http://localhost:${ PORT }` );
} );