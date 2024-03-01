import TaskManager from "./classes/TaskManager.js";
import { Priority } from "./interface/Tasks.js";
import CategoryManager from "./classes/CategoryManager.js";
// init form  so we can watch them with an addEventListener
const taskForm = document.querySelector('#taskForm');
const categoryForm = document.querySelector('#categoryForm');
// get localstorage to setup the manager
let localStorageDataTasks = localStorage.getItem('tasks') || '[]';
let localStorageDataCategories = localStorage.getItem('categories') || '[]';
// setup managers with localstorage data
let taskManager = new TaskManager(JSON.parse(localStorageDataTasks));
let categoryManager = new CategoryManager(JSON.parse(localStorageDataCategories));
// get all the filter so we can watch them with an addEventListener
const filterByPriority = document.querySelector('#filterPriority');
const filterByDate = document.querySelector('#filterDate');
const searchInput = document.querySelector("#searchInput");
const filterByCategory = document.querySelector("#filterCategory");
const tasksContainer = document.querySelector('#tasks');
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
const elements = [filterByPriority, filterByDate, filterByCategory, searchInput];
elements.forEach(element => {
    const eventType = element === searchInput ? 'input' : 'change';
    element.addEventListener(eventType, () => {
        filterTaskList(filterByPriority.value, filterByDate.value, searchInput.value, filterByCategory.value);
    });
});
//_______________________________________________________________________________________________________//
//watch if a new task/category is added
taskForm === null || taskForm === void 0 ? void 0 : taskForm.addEventListener('submit', (e) => {
    submitTask(e);
});
categoryForm === null || categoryForm === void 0 ? void 0 : categoryForm.addEventListener("submit", (event) => {
    submitCategory(event);
});
//_______________________________________________________________________________________________________//
// breakdown the process of displaying cards in chunk 
// 1st - Create the element ( can be different type (input,div, button .... this is why the K extend ...))
function createElementWithContent(tag, content, name) {
    const element = document.createElement(tag);
    if (tag === 'input' && name) {
        element.value = content;
        element.name = name;
    }
    element.textContent = content;
    return element;
}
// 2nd - Create all the needed button
function createButton(buttonText) {
    const button = document.createElement("button");
    button.textContent = buttonText;
    return button;
}
// generate a new card in the DOM
function createTaskCard(task) {
    var _a;
    const div = document.createElement("div");
    div.className = "task " + getPriorityClass(task.priority);
    div.dataset.id = task.id;
    const categoryContent = task.category ? task.category.name : 'Undefined'; // Assuming 'name' is a property of 'Category'
    const title = createElementWithContent("h3", task.title, 'title');
    const description = createElementWithContent("p", task.description, 'description');
    const endDate = createElementWithContent("p", `Date d'échéance : ${new Date(task.end_date)}`, 'end_date');
    const category = createElementWithContent('p', categoryContent, 'category');
    const editButton = createButton("Edit");
    const deleteButton = createButton("Delete");
    editButton.className += "edit-btn ";
    deleteButton.className += "delete-btn";
    div.append(title, description, endDate, editButton, deleteButton, category);
    (_a = document.querySelector('#tasks')) === null || _a === void 0 ? void 0 : _a.append(div);
}
// display all the new Cards
let displayTaskList = (tasksToShow = taskManager.tasks) => {
    const tasksContainer = document.querySelector('#tasks');
    if (tasksContainer) {
        tasksContainer.innerHTML = '';
        tasksToShow.forEach(createTaskCard);
    }
};
// big function that filter all the tasks generate a new array and then call display task list ( use filter for each ), there all on optional to avoid breaking thigs even tho i put it all when i call this function, might not be necessary to make them optional dont know
let filterTaskList = (filterPriority, filterDate, searchKeyword, filterCategory) => {
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
        filteredTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            task.description.toLowerCase().includes(searchKeyword.toLowerCase()));
    }
    if (filterCategory && filterPriority !== '') {
        filteredTasks = filteredTasks.filter((task) => { var _a, _b; return ((_a = task.category) === null || _a === void 0 ? void 0 : _a.id) === ((_b = categoryManager.getCategoryById(filterCategory)) === null || _b === void 0 ? void 0 : _b.id); });
    }
    displayTaskList(filteredTasks);
};
// submit a new task / handle the creation and the edit at the same time 
function submitTask(event) {
    var _a;
    event.preventDefault();
    const categories = categoryManager.listCategories();
    const selectedCategoryName = document.getElementById('categoryChoice').value;
    const selectedCategory = categories.find((item) => item.id === selectedCategoryName) || categories.find((item) => item.name === 'Undefined');
    let task = {
        priority: toPriority(document.getElementById('taskPriority').value),
        description: document.getElementById('taskDescription').value,
        title: document.getElementById('taskTitle').value,
        end_date: ((_a = document.getElementById('taskDueDate')) === null || _a === void 0 ? void 0 : _a.valueAsNumber) || new Date().getDate(), // if no date put today date
        category: selectedCategory
    };
    if (task.description === '') {
        showToast('You have to enter a description to continue', 5000);
        return;
    }
    if (task.title === '') {
        showToast('You have to enter a title to continue', 5000);
        return;
    }
    if (taskForm === null || taskForm === void 0 ? void 0 : taskForm.hasAttribute('data-editing-id')) {
        taskManager.editTask((taskForm === null || taskForm === void 0 ? void 0 : taskForm.getAttribute('data-editing-id')) || '', task);
        taskForm === null || taskForm === void 0 ? void 0 : taskForm.removeAttribute('data-editing-id');
        document.querySelector('#taskForm button[type="submit"]').textContent = 'Ajouter Tâche';
    }
    else {
        taskManager.addTask(task);
    }
    displayTaskList();
    taskForm === null || taskForm === void 0 ? void 0 : taskForm.reset();
}
// delete a card  from the DOM and remove it from memory
function deleteCard(id) {
    const card = document.querySelector(`[data-id="${id}"]`);
    if (card == null)
        throw new Error;
    else
        card.remove();
    taskManager.deleteTask(id);
}
// submit a new category, repopulate  the select box with options from the manager
function submitCategory(event) {
    event.preventDefault();
    let category = {
        name: document.getElementById('categoryTitle').value,
    };
    if (category.name === '') {
        showToast('You have to enter a name for the category', 5000);
        return;
    }
    categoryManager.addCategory(category);
    categoryForm === null || categoryForm === void 0 ? void 0 : categoryForm.reset();
    putOptionInSelect();
}
// generate the options and  add them in the select form and the filter, it's generate when you add a new one // see in sumbit Category
function putOptionInSelect() {
    let localStorageDataCategories = localStorage.getItem('categories') || '[]';
    const selectCategory = document.querySelector('#categoryChoice');
    const filterCategory = document.querySelector('#filterCategory');
    if (filterCategory)
        removeAllChildren(filterCategory);
    if (selectCategory)
        removeAllChildren(selectCategory);
    JSON.parse(localStorageDataCategories).forEach((cat, index) => {
        if (cat.id !== undefined) {
            const option = document.createElement("option");
            option.value = cat.id;
            option.innerHTML = cat.name;
            if (index === 1)
                option.selected = true;
            selectCategory.appendChild(option);
            const optionClone = option.cloneNode(true);
            filterCategory.appendChild(optionClone);
        }
    });
    const option = document.createElement("option");
    option.value = '';
    option.innerHTML = 'Undefined';
    selectCategory.appendChild(option);
    const optionClone = option.cloneNode(true);
    filterCategory.appendChild(optionClone);
}
//Clean the select before repopulate it with the data to avoid duplicate
function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
// little toast for error or validation message 
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast)
        return;
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
function getPriorityString(priority) {
    switch (priority) {
        case Priority.High: return 'high';
        case Priority.Mid: return 'medium';
        case Priority.Low: return 'low';
        default: return 'medium';
    }
}
function getPriorityClass(priority) {
    switch (priority) {
        case 'High': return 'high';
        case 'Mid': return 'mid';
        case 'Low': return 'low';
        default: return '';
    }
}
function toPriority(value) {
    switch (value) {
        case 'high':
            return Priority.High;
        case 'medium':
            return Priority.Mid;
        case 'low':
            return Priority.Low;
    }
}
//_________________________________________________________________________________________________________//
// add event listener for edit and delete button / the edit is not really user friendly , it's populate the creation form , not really intuitive
//+ the function can be refacto i think
if (tasksContainer) {
    tasksContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (target && target.matches('.delete-btn')) {
            const parentCard = target.closest('.task');
            if (parentCard) {
                const taskId = parentCard.getAttribute('data-id');
                if (taskId) {
                    deleteCard(taskId);
                }
            }
        }
        else if (target && target.matches('.edit-btn')) {
            const parentCard = target.closest('.task');
            if (parentCard) {
                const taskId = parentCard.getAttribute('data-id');
                const task = taskManager.getTaskById(taskId);
                if (task) {
                    document.getElementById('taskTitle').value = task.title;
                    document.getElementById('taskDescription').value = task.description;
                    document.getElementById('taskDueDate').value = new Date(task.end_date).toISOString().split('T')[0];
                    document.getElementById('taskPriority').value = getPriorityString(task.priority);
                    taskForm === null || taskForm === void 0 ? void 0 : taskForm.setAttribute('data-editing-id', taskId);
                    document.querySelector('#taskForm button[type="submit"]').textContent = 'Modifier Tâche';
                }
            }
        }
    });
}
// ''onMounted'', populate select and display existing card  
document.addEventListener("DOMContentLoaded", () => {
    displayTaskList();
    putOptionInSelect();
});
