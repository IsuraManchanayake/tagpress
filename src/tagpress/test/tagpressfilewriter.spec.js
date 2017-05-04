import { Folder } from '../model/fileinformation/folder'
import { File } from '../model/fileinformation/file'
import { TagPressFileWriter } from '../model/tagpressfilehandler/tagpressfilewriter'
import { Tag } from '../model/fileinformation/tag'
import { Category } from '../model/fileinformation/category'
import assert from 'assert'

describe('The TagPress file writer module', function() {

    it('.tagpress file updates', function() {
        var folder = new Folder('src/tagpress/test/example/')
        folder.addFile(new File('src/tagpress/test/example/1.png'))
        folder.addFile(new File('src/tagpress/test/example/2.png'))
        folder.addFile(new File('src/tagpress/test/example/3.jpg'))
        folder.addFile(new File('src/tagpress/test/example/abc.txt'))
        var fw = new TagPressFileWriter(folder)
        assert.equal(fw.update(), true)
    })

    it('new tag for existing file works', function() {
        var folder = new Folder('src/tagpress/test/example/')
        folder.addFile(new File('src/tagpress/test/example/1.png'))
        folder.addFile(new File('src/tagpress/test/example/2.png'))
        folder.addFile(new File('src/tagpress/test/example/3.jpg'))
        folder.addFile(new File('src/tagpress/test/example/abc.txt'))
        var fw = new TagPressFileWriter(folder)
        fw.update()
        assert.equal(fw.addTag('1.png', 'pop', 'music'), true)
    })

    it('new tag for new file works', function() {
        var folder = new Folder('src/tagpress/test/example/')
        folder.addFile(new File('src/tagpress/test/example/1.png'))
        folder.addFile(new File('src/tagpress/test/example/2.png'))
        folder.addFile(new File('src/tagpress/test/example/3.jpg'))
        folder.addFile(new File('src/tagpress/test/example/abc.txt'))
        var fw = new TagPressFileWriter(folder)
        fw.update()
        assert.equal(fw.addTag('4.png', 'pop', 'music'), true)
    })
})