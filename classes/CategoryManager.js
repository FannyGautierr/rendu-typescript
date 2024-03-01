export default class CategoryManager {
    constructor(categories) {
        this.categories = categories;
        try {
            const storedCategories = localStorage.getItem('categories');
            if (storedCategories) {
                this.categories = JSON.parse(storedCategories);
            }
        }
        catch (error) {
            console.error("Failed to load categories from localStorage:", error);
        }
    }
    // add a new category by adding name and generating an id and add it to the local storage
    addCategory(category) {
        try {
            const newCategory = Object.assign({ id: crypto.randomUUID() }, category);
            this.categories.push(newCategory);
            localStorage.setItem('categories', JSON.stringify(this.categories));
        }
        catch (error) {
            console.error("Failed to add category:", error);
        }
    }
    // pretty clear i think
    getCategoryById(id) {
        try {
            return this.categories.find(category => category.id === id);
        }
        catch (error) {
            console.error("Failed to get category by ID:", error);
            return undefined;
        }
    }
    // bis 
    listCategories() {
        try {
            return this.categories;
        }
        catch (error) {
            console.error("Failed to list categories:", error);
            return [];
        }
    }
}
