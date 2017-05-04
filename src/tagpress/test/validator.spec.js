import assert from 'assert'
import { listAllFiles } from '../model/tagpressfilehandler/validator'
import { Folder } from '../model/fileinformation/folder'

describe('validator module', function() {
    it('lists all files in a real folder', function() {
        assert.deepEqual(listAllFiles(new Folder('src/tagpress/test/example/')), ['.tagpress', '1.png', '2.png', '3.jpg', 'abc.txt'])
    })
})