import { Folder } from '../model/fileinformation/folder'
import assert from 'assert'
import fs from 'fs'
import { global } from '../global/global'

var folder

describe('The folder module', function() {

    it('folder creates', function() {
        folder = new Folder('/aa/bb/')
        assert.notEqual(folder, null)
    })

    it('folder name correct', function() {
        folder = new Folder('/aa/bb/')
        assert.equal(folder.name, 'bb')
    })

    it('default folder thumbnail available', function() {
        assert.equal(fs.existsSync(global.defaultFolderThumb), true);
    })

    it('default thumbnail creates', function() {
        folder = new Folder('/aa/bb/')
        assert.equal(folder.thumbnail, global.defaultFolderThumb)
    })

})