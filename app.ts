import TaskManager from "./classes/TaskManager.js";
import { Task, Priority } from "./interface/Tasks.js";
import CategoryManager from "./classes/CategoryManager.js";
import { Category } from "./interface/Categories.js";

// init form  so we can watch them with an addEventListener
const taskForm = document.querySelector('#taskForm') as HTMLFormElement | null;
const categoryForm = document.querySelector('#categoryForm') as  HTMLFormElement | undefined ;

// get localstorage to setup the manager
let localStorageDataTasks = localStorage.getItem('tasks') || '[]'; 
let localStorageDataCategories = localStorage.getItem('categories') || '[]' ;

// setup managers with localstorage data
let taskManager: TaskManager = new TaskManager(JSON.parse(localStorageDataTasks))
let categoryManager: CategoryManager = new CategoryManager(JSON.parse(localStorageDataCategories));

// get all the filter so we can watch them with an addEventListener
const filterByPriority: HTMLSelectElement = document.querySelector('#filterPriority') as HTMLSelectElement 
const filterByDate: HTMLInputElement = document.querySelector('#filterDate') as  HTMLInputElement
const searchInput: HTMLInputElement= document.querySelector("#searchInput") as HTMLInputElement
const filterByCategory: HTMLInputElement  = document.querySelector("#filterCategory") as HTMLInputElement
const tasksContainer: HTMLElement  = document.querySelector('#tasks') as HTMLElement

// all my ""watchers"" check if a filter change, if a task is submit ect... call filterTAskList
//_______________________________________________________________________________________________________//
// filterByPriority.addEventListener('change',()=>{
//     filterTaskList(filterByPriority.value, filterByDate.value, searchInput.value,filterByCategory.value)
// })

// filterByDate.addEventListener('change',()=>{
//     filterTaskList(filterByPriority.value, filterByDate.value, searchInput.value,filterByCategory.value)
// })

// filterByCategory.addEventListener('change',()=>{
//     filterTaskList(filterByPriority.value, filterByDate.value, searchInput.value,filterByCategory.value)
// })

// searchInput.addEventListener('input',()=>{
//     filterTaskList(filterByPriority.value, filterByDate.value, searchInput.value,filterByCategory.value)
// })

// better ?
const elements = [filterByPriority, filterByDate, filterByCategory, searchInput];

elements.forEach(element => {
    const eventType = element === searchInput ? 'input' : 'change';
    element.addEventListener(eventType, () => {
        filterTaskList(filterByPriority.value, filterByDate.value, searchInput.value, filterByCategory.value);
    });
});

//_______________________________________________________________________________________________________//
//watch if a new task/category is added

taskForm?.addEventListener('submit',(e)=>{
    submitTask(e)
})

categoryForm?.addEventListener("submit", (event) =>{
    submitCategory(event)
})

//_______________________________________________________________________________________________________//

// breakdown the process of displaying cards in chunk 
// 1st - Create the element ( can be different type (input,div, button .... this is why the K extend ...))
function createElementWithContent<K extends keyof HTMLElementTagNameMap>(tag: K, content: string, name?: string): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    if(tag==='input' && name){
        (element as HTMLInputElement).value=content;
        (element as HTMLInputElement).name = name
    }
    element.textContent = content;
    return element;
}
// 2nd - Create all the needed button
function createButton(buttonText: string): HTMLElement {
    const button = document.createElement("button");
    button.textContent = buttonText;
    return button;
}

// generate a new card in the DOM
function createTaskCard(task: Task): void {
    const div: HTMLElement = document.createElement("div");
    div.className = "task " + getPriorityClass(task.priority);
    div.dataset.id = task.id;
    const categoryContent = task.category ? task.category.name : 'Undefined'; // Assuming 'name' is a property of 'Category'


    const title: HTMLElement = createElementWithContent("h3", task.title, 'title');
    const description: HTMLElement = createElementWithContent("p", task.description, 'description');
    const endDate: HTMLElement = createElementWithContent("p", `Date d'échéance : ${new Date(task.end_date)}`, 'end_date');
    const category: HTMLElement = createElementWithContent('p', categoryContent, 'category');
    const editButton: HTMLElement = createButton("Edit");
    const deleteButton: HTMLElement = createButton("Delete");

    editButton.className += "edit-btn "
    deleteButton.className += "delete-btn"

    div.append(title, description, endDate, editButton, deleteButton,category);

    document.querySelector('#tasks')?.append(div);
}

// display all the new Cards
let displayTaskList = (tasksToShow: Task[] = taskManager.tasks): void => {
    const tasksContainer = document.querySelector('#tasks');
    if (tasksContainer) {
        tasksContainer.innerHTML = '';
        tasksToShow.forEach(createTaskCard); 
    }
}

// big function that filter all the tasks generate a new array and then call display task list ( use filter for each ), there all on optional to avoid breaking thigs even tho i put it all when i call this function, might not be necessary to make them optional dont know
let filterTaskList = (filterPriority?: string, filterDate?: string, searchKeyword?: string, filterCategory?: string): void => {
    let filteredTasks = taskManager.tasks;
   
    if (filterPriority && filterPriority !== 'all') {
        filteredTasks = filteredTasks.filter(task => getPriorityClass(task.priority).toLowerCase() === filterPriority.toLowerCase());
    }
 
    if (filterDate) {
        filteredTasks = filteredTasks.filter(task => {
            const taskEndDate = new Date(task.end_date);
            return taskEndDate.toISOString().split('T')[0] === filterDate;
        });
    }
    if (searchKeyword && searchKeyword.trim() !== '') {
        filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(searchKeyword.toLowerCase()) || 
            task.description.toLowerCase().includes(searchKeyword.toLowerCase()));
    }

    if (filterCategory && filterPriority !== '') {
        filteredTasks = filteredTasks.filter((task) => task.category?.id === categoryManager.getCategoryById(filterCategory)?.id)
    }
    displayTaskList(filteredTasks);
}

// submit a new task / handle the creation and the edit at the same time 
function submitTask(event: Event): void{
    event.preventDefault();
    const categories: Category[] = categoryManager.listCategories()
    const selectedCategoryName = (document.getElementById('categoryChoice') as HTMLSelectElement).value;
    const selectedCategory: Category | undefined = categories.find((item) => item.id === selectedCategoryName) || categories.find((item) => item.name === 'Undefined');
    let task: Task = {
        priority: toPriority((document.getElementById('taskPriority') as HTMLSelectElement).value) as Priority,
        description: (document.getElementById('taskDescription') as HTMLInputElement).value, 
        title:   (document.getElementById('taskTitle') as HTMLInputElement).value,
        end_date: (document.getElementById('taskDueDate') as HTMLInputElement)?.valueAsNumber || new Date().getDate(), // if no date put today date
        category: selectedCategory
    }
    if(task.description === ''){
        showToast('You have to enter a description to continue', 5000);
        return;
    }
    if(task.title === ''){
        showToast('You have to enter a title to continue', 5000);
        return;
    }

    if( taskForm?.hasAttribute('data-editing-id')){
        taskManager.editTask(taskForm?.getAttribute('data-editing-id') ||  '', task);
        taskForm?.removeAttribute('data-editing-id');
        (document.querySelector('#taskForm button[type="submit"]') as HTMLButtonElement).textContent = 'Ajouter Tâche'; 

    }else{
        taskManager.addTask(task)
    }
    displayTaskList()
    taskForm?.reset()
}

// delete a card  from the DOM and remove it from memory
function deleteCard(id: string): void {
    const card = document.querySelector(`[data-id="${id}"]`) as HTMLDivElement;
    if (card == null) throw new Error
    else card.remove();

    taskManager.deleteTask(id);
}
// submit a new category, repopulate  the select box with options from the manager
function submitCategory(event: Event): void{
    event.preventDefault();
    let category: Category = {
        name: (document.getElementById('categoryTitle') as HTMLInputElement).value,
    }
    if(category.name === ''){
        showToast('You have to enter a name for the category',5000)
        return
    }
    categoryManager.addCategory(category);

    categoryForm?.reset()
    putOptionInSelect()
}
// generate the options and  add them in the select form and the filter, it's generate when you add a new one // see in sumbit Category
function putOptionInSelect(){
    let localStorageDataCategories = localStorage.getItem('categories') || '[]' ;
    const selectCategory = document.querySelector('#categoryChoice') as HTMLElement
    const filterCategory = document.querySelector('#filterCategory') as HTMLElement

    if (filterCategory) removeAllChildren(filterCategory);
    if (selectCategory) removeAllChildren(selectCategory);

    JSON.parse(localStorageDataCategories).forEach((cat: Category, index: number)=>{
        if(cat.id !== undefined){
            const option = document.createElement("option");
            option.value = cat.id 
            option.innerHTML = cat.name
            if(index === 1) option.selected = true
            selectCategory!.appendChild(option)
            const optionClone = option.cloneNode(true);
            filterCategory!.appendChild(optionClone)
        }
    }) 
    const option = document.createElement("option");
    option.value = '' 
    option.innerHTML = 'Undefined'
    selectCategory!.appendChild(option)
    const optionClone = option.cloneNode(true);
    filterCategory!.appendChild(optionClone)
}

//Clean the select before repopulate it with the data to avoid duplicate
function removeAllChildren(element: HTMLElement) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// little toast for error or validation message 
function showToast(message: string, duration: number = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.style.display = 'none';
            toast.style.opacity = '0.9'; 
        }, 600);
    }, duration);
}

// use the enum in the app by getting it from de task manager, might be overkilled or unnecessary dont know 
//_________________________________________________________________________________________________________//

function getPriorityString(priority: string): string {
    switch (priority) {
        case Priority.High: return 'high';
        case Priority.Mid: return 'medium';
        case Priority.Low: return 'low';
        default: return 'medium'; 
    }
}
function getPriorityClass(priority: Priority): string {
    switch(priority) {
        case 'High': return 'high';
        case 'Mid': return 'mid';
        case 'Low': return 'low';
        default: return '';
    }
}
function toPriority(value: string): Priority | undefined {
    switch (value){
      case 'high':
          return Priority.High;
      case 'medium':
          return Priority.Mid;
      case 'low':
          return Priority.Low
    }
}

//_________________________________________________________________________________________________________//

// add event listener for edit and delete button / the edit is not really user friendly , it's populate the creation form , not really intuitive
//+ the function can be refacto i think
if (tasksContainer) {
    tasksContainer.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (target && target.matches('.delete-btn')) {
            const parentCard = target.closest('.task');
            if (parentCard) {
            
                const taskId: string = parentCard.getAttribute('data-id') as string;
                if (taskId) {
                    deleteCard(taskId);
                }
            }
        } 
        else if (target && target.matches('.edit-btn')) {
            const parentCard = target.closest('.task');
            if (parentCard) {
                const taskId: string = parentCard.getAttribute('data-id') as string;
                const task: Task = taskManager.getTaskById(taskId) as Task; 

                if (task) {
                    (document.getElementById('taskTitle') as HTMLInputElement).value = task.title;
                    (document.getElementById('taskDescription') as HTMLTextAreaElement).value = task.description;
                    (document.getElementById('taskDueDate') as HTMLInputElement).value = new Date(task.end_date).toISOString().split('T')[0];
                    (document.getElementById('taskPriority') as HTMLSelectElement).value = getPriorityString(task.priority); 

        
                    taskForm?.setAttribute('data-editing-id', taskId); 
                    (document.querySelector('#taskForm button[type="submit"]') as HTMLButtonElement).textContent = 'Modifier Tâche'; 

                }
            }
        }
    });
}

// ''onMounted'', populate select and display existing card  
document.addEventListener("DOMContentLoaded",()=>{
    displayTaskList()
    putOptionInSelect()
})



