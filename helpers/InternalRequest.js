var RequestHelper = require('./RequestHelper')

class InternalRequest extends RequestHelper{
  constructor(method ,url, access_token){
    super(method ,url , undefined, undefined)
    this.access_token = access_token
  }

  async query(){
      var j = this.request.jar();
      var cookie = this.request.cookie('access_token=' + this.access_token);
      j.setCookie(cookie, this.param.url);
      this.param.jar = j;
      var result = undefined;

      await this.request(this.param, (error, response, body) =>{
        if(error){
          result = undefined;
        //  console.log('ERROR WITH QUERY')
        }
        else if (response) {
        //  console.log('QUERY WAS SUCCESSFUL')
          result = body;
        }
      })
      return result;
    }
}

module.exports = InternalRequest
