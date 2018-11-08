module.exports = class StringBuilder{

  create_comma_seperated_query_parameter(arr){
    var conString = arr[0]
    for(let i = 1; i < arr.length; i++){
      conString = conString + "," + arr[i]
    }
    return conString.trim()
  }

  deconstruct_comma_seperated_query_parameter(my_str){
    my_string.split(',')
  }

}
