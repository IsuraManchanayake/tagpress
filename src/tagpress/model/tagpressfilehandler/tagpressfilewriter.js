import { global } from '../../global/global'
import { fromFile, fromFiles, fromFolder } from './writeobject'
import { TagPressFileReader } from './tagpressfilereader'
import { File } from '../fileinformation/file'
import { Tag } from '../fileinformation/tag'
import { Category } from '../fileinformation/category'
import jsonfile from 'jsonfile'

export class TagPressFileWriter {
    /**
     * Creates a TagPressFileWriter object ready to read from a folder
     * 
     * @param {Folder} folder 
     */
    constructor(folder) {
        this.folder = folder
    }

    /**
     * Updates .tagpress file according to folder object
     */
    update() {
        jsonfile.writeFileSync(this.folder.path + global.tagpressFileName,
            fromFolder(this.folder), { spaces: global.tagpressspaces },
            function(err) {
                if (err) {
                    console.log(err)
                }
                return false
            })
        return true
    }

    /**
     * Adds tag under the given tag name and category
     * 
     * @param {string} fileName 
     * @param {string} tagName 
     * @param {string} categoryName 
     */
    addTag(fileName, tagName, categoryName) {
        var fr = new TagPressFileReader(this.folder.path)
        this.folder = fr.read()
        var file = new File(this.folder.path + fileName)
        this.folder.appendTag(file, new Tag(tagName, new Category(categoryName)))
        return this.update()
    }
}