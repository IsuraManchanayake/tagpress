export class Tag {

    /**
     * Creates a tag object
     * 
     * @param {Category} category 
     */
    constructor(name, category, tid) {
        this.name = name || ""
        this.category = category || null
        this.tid = tid
    }
}