const Folder = require('./folder')
const util = require('util')

var UnindexedFolder = function(path, files) {
    Folder.call(this, path, files)
}

util.inherits(UnindexedFolder, Folder)

module.exports = UnindexedFolder