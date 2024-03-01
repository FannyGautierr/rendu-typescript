import { Category } from "../interface/Categories";

export default class CategoryManager {

  constructor(private categories: Category[]) {}

  // add a new category by adding name and generating an id and add it to the local storage
  addCategory(category: Category): void {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      ...category
    };
    this.categories.push(newCategory);
    localStorage.setItem('categories',JSON.stringify(this.categories))
  }

  // pretty clear i think
  getCategoryById(id: string): Category | undefined {
    return this.categories.find(category => category.id === id);
  }
  // bis 
  listCategories(): Category[] {
    return this.categories;
  }

  // My taskManager might be a bit cleaner and more in typescriptgood practice
}

