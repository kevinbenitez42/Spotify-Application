class WebpackHelper{

  static helperRootMap(array){
    let func = (filename) =>{return './helpers/' + filename }
    return array.map(func)
  }

  static viewRootMap(array){
    let func = (filename) =>{return './views/js/pages/' + filename }
    return array.map(func)
  }

}

module.exports = {
  WebpackHelper: WebpackHelper
}
