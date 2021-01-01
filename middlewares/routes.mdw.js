// const auth = require('./auth.mdw');

module.exports = function (app) {
  app.get('/', function (req, res) {
    // res.send('Hello World!');
    res.render('home');
  });

}