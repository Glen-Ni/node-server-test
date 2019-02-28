var http = require('http')
var path = require('path')
var fs = require('fs')
var url = require('url')

var routes = {
  '/': function(req, res) {
    readFile(path.join(__dirname, '/static/routes.html'), res)
  },
  '/login': function(req, res) {
    readFile(path.join(__dirname, '/static/login.html'), res)
  },
  '/music-player': function(req, res) {
    readFile(path.join(__dirname, '/static/index.html'), res)
  },
  '/getWeather': function(req, res) {
    var ret
    if (req.query.city == 'beijing') {
      ret = {
        city: 'beijing',
        weather: '晴天'
      }
    } else {
      ret = {
        city: req.query.city,
        weather: '不知道'
      }
    }
    res.end(JSON.stringify(ret))
  }
}

var server = http.createServer(function(req, res) {
  routePath(req, res)
  // res.setHeader('content-type', 'text/html; charset=utf-8')
  // console.log(req)
  // res.end('<h1>wdnmd</h1>')
})

server.listen(8100, function() {
  console.log('8100running')
})
function routePath(req, res) {
  var pathObj = url.parse(req.url, true)
  console.log(pathObj)
  var handlerFn = routes[pathObj.pathname]
  console.log('~~~~pathname:' + pathObj.pathname)
  req.query = pathObj.query
  if (handlerFn) {
    return handlerFn(req, res)
  }
  console.log(path.join(__dirname, 'static', pathObj.pathname))
  readFile(path.join(__dirname, 'static', pathObj.pathname), res)
}
function readFile(localPath, res) {
  fs.readFile(localPath, 'binary', function(err, data) {
    if (err) {
      return res.end('readfile failed')
    }
    res.write(data, 'binary')
    res.end()
  })
}
