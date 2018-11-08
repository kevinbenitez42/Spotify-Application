var express = require('express')
var Router =  require('express-promise-router')
var router =  Router()
var request = require('request-promise-native')
var bodyParser = require("body-parser")
var jsonParser = bodyParser.json()
const queryString = require('query-string')
var auth = require('../middlewares/auth.js')
var api  = require('./apiInformation')
var cookieParser = require('cookie-parser')

router.get('/',function(req,res){
  res.render('login.html');
})

router.get('/authorize', (req,res,next) => {

  /*
    Here we are requesting an authoriation code by the user, when user hits Login
    on the landing page, the browser is redirected to the spotify login Page
    where he/she is asked to login through spotify and/or approve for certain apiInformation
    from his/her user account to be exposed to SoundFeed
  */

  var authorize = 'https://accounts.spotify.com/authorize'+
    '?response_type=code' +
    '&client_id=' + api['clientID'] +
    (api['scopes'] ? '&scope=' + encodeURIComponent(api['scopes']) : '') +
    '&redirect_uri=' + encodeURIComponent(api['redirect_uri']);
    res.redirect(authorize);

})

router.get('/getAuthenticationCode',[jsonParser, auth.authorize], async function(req,res,next){
  var access_token    = res.locals.access_token;
  var refresh_token   = res.locals.refresh_token;
  var user            = undefined;

  /* getting user information  after login */
  var example_options = {
    method : 'GET',
    url: 'https://api.spotify.com/v1/me',
    headers:{Authorization:'Bearer ' + access_token},
    json: true
  }

 await request(example_options, function(error, response, body){
   if(error){ console.log(error) }
   else if(response){
     user = response['body']
   }
});

Date.prototype.addHours = function(h){
  this.setHours(this.getHours() + h);
  return this
}

res.cookie('access_token', access_token, {
  expires: new Date().addHours(1),
  maxAge: 3600000,
  httpOnly: true
})

res.render('user_page.html')
})


router.get('/*', function(req,res){
  res.render('error.html')
})

module.exports = router
