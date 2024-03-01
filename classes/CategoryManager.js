export default class CategoryManager {
    constructor(categories) {
        this.categories = categories;
    }
    // add a new category by adding name and generating an id and add it to the local storage
    addCategory(category) {
        const newCategory = Object.assign({ id: crypto.randomUUID() }, category);
        this.categories.push(newCategory);
        localStorage.setItem('categories', JSON.stringify(this.categories));
    }
    // pretty clear i think
    getCategoryById(id) {
        return this.categories.find(category => category.id === id);
    }
    // bis 
    listCategories() {
        return this.categories;
    }
}
