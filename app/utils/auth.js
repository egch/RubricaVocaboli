var basicAuth = require('basic-auth');

exports.basicAuth = function (req, res, next) {
  console.log('header: '+req.headers['authorization']);
  function unauthorized(res) {
    console.log('unauthorized user');
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'username' && user.pass === 'password') {
    return next();
  } else {
    return unauthorized(res);
  };
};