import { global } from '../../global/global'

export class Folder {
    /**
     * creates Folder objects
     * 
     * @param {string} path 
     * @param {File[]} files 
     */
    constructor(path, files) {
        this.path = path || null
        this.files = files || []

        this.name = ""
        if (this.path !== null) {
            var pathSplit = this.path.split("/")
            if (pathSplit.length > 0) {
                this.name = pathSplit[pathSplit.length - 2]
            }
        }

        this.thumbnail = global.defaultFolderThumb
    }

    /**
     * set files attribute
     * 
     * @param {File[]} files 
     */
    setFiles(files) {
        this.files = files
    }

    /**
     * Add a file to file list. If the file already exists, new tags of the
     * file are appended 
     * 
     * @param {File} file 
     */
    addFile(file) {
        for (var i = 0; i < this.files.length; i++) {
            if (this.files[i].name == file.name) {
                this.files[i].setTags(file.tags)
            }
        }
        this.files.push(file)
    }

    /**
     * Add a set of files to the file list. If a file already
     * exists, the file is handled as in addFile(file) method
     * 
     * @param {File[]} files 
     */
    appendFiles(files) {
        files.forEach(function(file) {
            this.addFile(file)
        })
    }

    /**
     * Appends tag to a file and added to the files list. If the file 
     * already exists, the tags are appended
     * 
     * @param {File} file 
     * @param {Tag} tag 
     */
    appendTag(file, tag) {
        for (var i = 0; i < this.files.length; i++) {
            if (this.files[i].name == file.name) {
                this.files[i].addTag(tag)
                return;
            }
        }
        file.addTag(tag)
        this.files.push(file)
    }
}

// module.exports = Folder