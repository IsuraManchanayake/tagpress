import { Folder } from '../fileinformation/folder'
import { File } from '../fileinformation/file'

/**
 * Casts tagpressfile (JSON object type which .tagpress file is written) 
 * object to Folder object. Path should be specified. 
 * 
 * @param {string} path 
 * @param {tagpressfile} tagpressfile
 */
export const toFolder = (path, tagpressfile) => {
    var folder = new Folder(path)
    if (tagpressfile.tagpressfile !== undefined) {
        tagpressfile.tagpressfile.forEach(function(obj) {
            folder.addFile(new File(path + obj.name, obj.tags))
        })
    }
    return folder
}