export class Tag {

    /**
     * Creates a tag object
     * 
     * @param {Category} category 
     */
    constructor(name, category) {
        this.name = name || ""
        this.category = category || null
    }
}