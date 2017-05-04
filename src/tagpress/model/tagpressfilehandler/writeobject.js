export const fromFile = function(file) {
    return {
        name: file.name,
        tags: file.tags
    }
}

export const fromFiles = function(files) {
    var tagpressfile = []
    files.forEach(function(file) {
        tagpressfile.push(fromFile(file))
    })
    return { tagpressfile }
}

export const fromFolder = function(folder) {
    return fromFiles(folder.files)
}