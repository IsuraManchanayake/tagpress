import { global } from '../../global/global'
import fs from 'fs'
import jsonfile from 'jsonfile'
import { toFolder } from './readobject'
import { Folder } from '../fileinformation/folder'

export class TagPressFileReader {

    /**
     * Creates TagPressFileReader
     * 
     * @param {string} folderPathName 
     */
    constructor(folderPathName) {
        this.path = folderPathName
    }

    /**
     * reads from the path and returns a Folder related to .tagpress file
     */
    read() {
        return toFolder(this.path, jsonfile.readFileSync(this.path + global.tagpressFileName))
    }
}