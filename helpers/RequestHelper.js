var request = require('request-promise-native')
request = request.defaults({jar: true})

var queryString = require('query-string')

class RequestHelper{

  constructor(method, url, limit, offset) {
    this.request = request
    this.param = undefined
    this.access_token = undefined
    this.param = this.setParameters(method,url,limit,offset)
  };

  setParameters(method, url, limit , offset){
    var queryParameters = undefined;

    if(limit === undefined || offset === undefined){
      queryParameters = undefined
    }
    else{
      queryParameters =  '?' + queryString.stringify({
        limit: limit,
        offset: offset
      })
    }

    var result = {
      method: method,
      url:    url + ((queryParameters === undefined) ? '' : queryParameters),
      json: true
    };

    return result

  }

  async query(){
      var result = undefined;
      await this.request(this.param, (error, response, body) =>{
        if(error){
          result = undefined;
        //  console.log('ERROR WITH QUERY')
        }
        else if (response) {
          //console.log('QUERY WAS SUCCESSFUL')
          result = body;
        }
      })
      return result;
    }


}

module.exports = RequestHelper
