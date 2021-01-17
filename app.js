const express = require( 'express' );
var expressSession = require( 'express-session' );
var bodyParser = require( 'body-parser' );
var passport = require( 'passport' );

require( 'express-async-errors' );
const app = express();

app.use( bodyParser.json() );
app.use( bodyParser.text() );
app.use( express.urlencoded( {
  extended: true
} ) );

app.use( '/public', express.static( 'public' ) );
// app.use(express.static(__dirname + 'public'));
app.use( require( 'express-session' )( { secret: 'keyboard cat', resave: true, saveUninitialized: true } ) );
app.use( passport.initialize() );
app.use( passport.session() );

require( './middlewares/view.mdw' )( app );
//require( './middlewares/session.mdw' )( app );
require( './middlewares/locals.mdw' )( app );
require( './middlewares/routes.mdw' )( app );
require( './middlewares/error.mdw' )( app );


const PORT = process.env.PORT || 3000;
app.listen( PORT, function ()
{
  console.log( `Example app listening at http://localhost:${ PORT }` );
} );