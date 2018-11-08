const queryString = require('query-string')
var api  = require('../controllers/apiInformation')
var request = require('request-promise-native')

var authorize = async (req,res,next) => {

    var access_token  = undefined;
    var refresh_token = undefined;

    /* If the user is authorized through spotify when he logs in
       spotify redirects to the route and returns an authentication code*/

    extractedQueryString = queryString.extract(req.url);
    result = queryString.parse(extractedQueryString);
    if(result['code'] !== undefined){

      /*if there was not problem getting the authentication code
        We query spotify again for an access and refresh token using the code for which the user will
        be able to use to access data from his account, here we use the request module
        */

       var params = {
         grant_type: 'authorization_code',
         code: result['code'],
         redirect_uri: api['redirect_uri']
       }


      /* Here we we use base64 encoding for clientid:client secrete string for authorization*/
      var auth = new Buffer(api['clientID'] + ':' + api['clientSecret']).toString('base64');

      /* Parameters for request for auth token*/
      var options = {
        url: 'https://accounts.spotify.com/api/token',
        form: params,
        headers: {
          Authorization: 'Basic ' + auth,
          'Content-Type': 'application/json'
        },
        json: true
      }

      await request.post(options ,function(error, response, body) {

        if(error){}
        else{
          if(body['error']){
            console.log(body)
          }
          else{
            access_token            = body['access_token'];
            refresh_token           = body['refresh_token'];
            res.locals.access_token  = access_token;
            res.locals.refresh_token = refresh_token;
            next()
          }
        }
      }
    );
  }
    else{
      console.log('there was an error')
      res.render('error.html')
    }

}

module.exports = {
  authorize: authorize
}
