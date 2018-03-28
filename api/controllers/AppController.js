const fs = require('fs')
const path = require('path')

module.exports = {

  serve: function (req, res) {
    let app = __dirname + '/../../assets/index.html'
    res.sendfile(path.resolve(app))
  }
}
