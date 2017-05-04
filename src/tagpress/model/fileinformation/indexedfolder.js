const Folder = require('./folder')
const util = require('util')

var IndexedFolder = function(path, files) {
    Folder.call(this, path, files)
}

util.inherits(IndexedFolder, Folder)

module.exports = IndexedFolder