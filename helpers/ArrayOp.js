
module.exports = class ArrayOp{


  uniq_elem(arr){
    var uniq_arr = []
       for(let i of arr){
         var flag = false
         for(let j of uniq_arr){
           if(i === j){ flag = true}
         }
         if(flag !== true){ uniq_arr.push(i);}
         flag = false
       }
   return uniq_arr
  }

  uniq_elem_func(arr,my_func){
    var uniq_arr = []
       for(let i of arr){
         var flag = false
         for(let j of uniq_arr){
           if(my_func(i,j)){
             flag = true
           }
         }
         if(flag !== true){ uniq_arr.push(i);}
         flag = false
       }
   return uniq_arr
  }
  /*takes in array, processes successive n input elements, creates array of
    n output elements for each set of input elements */
  async map_reduce(arr, n, func){

    var result = []
    while(arr.length !== 0){
      var subArray = []
      if(arr.length >= n){
        subArray = arr.splice(0,n)
      }
      else{
        subArray = arr.splice(0, arr.length)
      }
      var elem = await func(subArray)
      result.push(elem)
      
    }

    return new Promise(resolve => {
      resolve(result)
    })
}
}
