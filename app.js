//Create Login page with form and save
//information into a database

/*
  Here we are importing express module
  which is a middleware and routing framework
  that runs on top on nodejs
*/
const express = require('express')
var path      = require('path')
var cors = require('cors');


/*
  we are listening on port 3000
*/

const port = 3000

/*
  here we create an instance and set the view template engine
  to be ejs
*/

const app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')

/*
   Here we are serving static files. these static files are created
   using the build script 'npm run build' which transpiles jsx and es6 code into
   es5 code.
*/
app.use(cors({origin: 'http://localhost:3000'}));
app.use('/static', express.static(path.join(__dirname, 'dist/')))
app.use('/static', express.static(path.join(__dirname, '/node_modules/react/umd/')))
app.use('/static', express.static(path.join(__dirname, '/node_modules/react-dom/umd')))
/*
  here we set where we are routing to. routing
  refers to how endpoints(URI's) map to certain middleware modules
  and responds to particular requests (GET,POST,etc...)
  at those endpoints
*/

var routes = {
  views       : './views',
  controllers : './controllers',
  middlewares : './middlewares',
  helpers     : './helpers'
}

/*
  Here we are mounting, or installing middleware functions at specified path
  .These middleware functions are executed when the base of the requested path
  matches the assigned path. In this case the assigned path is ./controllers
  and when we get a request at localhost:3000/controllers, the base path matches
  controllers and now we execute middleware functions at that path.
  by default, this will mount index.js within routes.controllers
*/
app.use(require(routes.controllers))

/* listening for connections on port 3000*/
app.listen(port)
