express = require 'express'
app = express()
http = require('http').createServer(app)
path = require 'path'
coffee = require 'coffee-middleware'
fs = require 'fs'
less = require 'less-middleware',


#http.listen(port, ipaddr)

http.listen(8080, ->
  console.log("Listening on " + 8080)
)

module.exports = http

coffeeDir = path.join(__dirname, 'coffee')
jsDir = path.join(__dirname, 'public/javascripts')

app.use(less(
  src: path.join(__dirname, 'public/stylesheets')
  prefix: '/stylesheets'
))

app.use(coffee(
  src: path.join(__dirname, 'public/javascripts')
  prefix: '/javascripts'
))
#app.use(express.cookieParser())

#app.use('/view', express.static(__dirname + '/view'));
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', __dirname + '/view')
app.set('view engine', 'jade')

app.get '/', (req, res) ->
  res.render(__dirname+'/view/index.jade')

app.get '/view/*', (req, res) ->
  res.render(__dirname+'/view/' + req.params[0] + '.jade')
