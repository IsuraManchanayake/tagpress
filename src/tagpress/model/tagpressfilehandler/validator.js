import fs from 'fs'

export const listAllFiles = (folder) => {
    var path = folder.path || folder
    return fs.readdirSync(path)
}