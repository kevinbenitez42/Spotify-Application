/*
  here we install middeware functions, in our index.js
  file, the purpose of index.js is to load all other controllers and maybe
  define some paths
*/

const express = require('express')
const router = express.Router()

/*
  Here we mount 2 other middleware functions
  using router

  middleware descriptions:
    admin:
      the administration page of the application
    login:
      the login page where users will create a profile and be
      able to login, login should redirect to an application page
      and save the information to postgressql
*/

const controllers = {
  login      : './login',
  logout     : './logout',
  userPage   : './userPage',
}

/*mounting middleware*/
/*this is routing level middleware routing, which allows us
to install seperate application modules seperated from the
main application, these routes have no direct knowledge of the shared
app instance and run on their own, so thats why you will see '/' as
the starting url for the app, its like they are in their own
little world*/

router.use('/login',        require(controllers.login))
router.use('/logout',       require(controllers.logout))
router.use('/userPage',     require(controllers.userPage))


/*
  if we execute localhost:3000/ or localhost:3000/index.js
  will work the same and execute the callback below
*/

router.get('/', function(req, res){
  const { statusCode } = req;
  res.render('index.html')
})


module.exports = router;
