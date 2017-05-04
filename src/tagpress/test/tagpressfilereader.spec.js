import { Folder } from '../model/fileinformation/folder'
import { File } from '../model/fileinformation/file'
import { TagPressFileReader } from '../model/tagpressfilehandler/tagpressfilereader'
import assert from 'assert'


describe('The TagPress file reader module', function() {
    it('reads a real .tagpress file', function() {
        var fr = new TagPressFileReader('src/tagpress/test/example/')
        var folder = fr.read()
        assert.equal(
            folder.name == 'example' &&
            folder.path == 'src/tagpress/test/example/' &&
            folder.files.map(function(e) { return e.name }).indexOf('2.png') >= 0, true
        )
    })
})