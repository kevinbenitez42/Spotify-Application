var RequestHelper = require('./RequestHelper')

class SpotifyRequest extends RequestHelper{

  constructor(method ,url ,limit ,offset ,access_token ){
    super(method,url,limit,offset)
    this.access_token = access_token

    this.param.headers = {
      Authorization:'Bearer ' + this.access_token,
      'Content-Type': 'application/json'
    }


  }
}

module.exports = SpotifyRequest
