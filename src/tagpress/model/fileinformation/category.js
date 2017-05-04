export class Category {
    /**
     * Creates Category object with name and color.
     * If name and color is not defined, default values are used.
     * 
     * Note
     * ====
     * Colors should be CSS colors.
     * 
     * @param {string} name 
     * @param {string} color 
     */
    constructor(name, color) {
        this.name = name || "default"
        this.color = color || "green"
    }
}