import { File } from '../model/fileinformation/file'
import assert from 'assert'
import fs from 'fs'
import { global } from '../global/global'

var file

describe('The file module', function() {

    it('file creates', function() {
        file = new File('/aa/bb/cc.png', [])
        assert.notEqual(file, null)
    })

    it('file name correct', function() {
        file = new File('/aa/bb/cc.png')
        assert.equal(file.name, 'cc.png')
    })

    it('image thumbnail creates', function() {
        file = new File('/aa/bb/cc.png')
        assert.equal(file.thumbnail, file.path)
    })

    it('default file thumbnail available', function() {
        assert.equal(fs.existsSync(global.defaultFileThumb), true);
    })

    it('default thumbnail creates', function() {
        file = new File('/aa/bb/dd.abc')
        assert.equal(file.thumbnail, global.defaultFileThumb)
    })

})