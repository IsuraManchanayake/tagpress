import { global } from '../../global/global'

export class File {
    /**
     * Creates File object
     * @param {string} path 
     * @param {Tag} tags 
     */
    constructor(path, tags) {
        this.path = path || null

        this.name = ""
        if (this.path !== null) {
            var pathSplit = this.path.split("/")
            if (pathSplit.length > 0) {
                this.name = pathSplit[pathSplit.length - 1]
            }
        }

        this.tags = tags || []
        this.thumbnail = this.getThumbnail()
    }

    /**
     * Appends a tag to a file. Ignores if the tag is already present.
     * @param {Tag} tag 
     */
    addTag(tag) {
        for (var i = 0; i < this.tags.length; i++) {
            tg = this.tags[i]
            if (tg.name == tag.name && tg.category == tag.category) {
                return;
            }
        }
        this.tags.push(tag)
    }

    /**
     * Appends a list of tags to the tag list.
     * 
     * @param {Tag[]} tags 
     */
    appendTags(tags) {
        tags.forEach(function(tag) {
            this.addTag(tag)
        })
    }

    /**
     * Sets tag list
     * 
     * @param {Tag[]} tags 
     */
    setTags(tags) {
        this.tags = tags
    }

    /**
     * Sets thumbnail of the object according to the file extension type
     */
    getThumbnail() {
        try {
            var imgExtensions = ["jpg", "jpeg", "png", "gif"]
            var fontExtensions = ["ttf", "ttc", "otf"]
            var fileSplit = this.name.split(".")
            if (fileSplit.length > 0) {
                var ext = fileSplit[fileSplit.length - 1]
                if (imgExtensions.indexOf(ext) >= 0) {
                    return this.path
                }
                this.isFont = (fontExtensions.indexOf(ext) >= 0);
            }
        } catch (err) {
            return global.defaultFileThumb
        }
        return global.defaultFileThumb
    }
}