import { Priority } from "../interface/Tasks.js";
export default class TaskManager {
    constructor(_tasks) {
        this._tasks = _tasks;
        //load task from localstorgae on init
        this.loadTasks();
    }
    get tasks() {
        return this._tasks;
    }
    saveTasks() {
        try {
            localStorage.setItem('tasks', JSON.stringify(this._tasks));
        }
        catch (error) {
            console.error("Failed to save tasks:", error);
        }
    }
    loadTasks() {
        try {
            const tasksJson = localStorage.getItem('tasks');
            if (tasksJson) {
                this._tasks = JSON.parse(tasksJson);
            }
        }
        catch (error) {
            console.error("Failed to load tasks from localStorage:", error);
        }
    }
    // random function that might be usefull
    // use the enum in the app by getting it from de task manager, might be overkilled or unnecessary dont know 
    //_________________________________________________________________________________________________________//
    getPriorityString(priority) {
        switch (priority) {
            case Priority.High: return 'high';
            case Priority.Mid: return 'medium';
            case Priority.Low: return 'low';
            default: return 'medium';
        }
    }
    toPriority(value) {
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
    // ''''''''''''''''CRUD''''''''''''''''''''''''
    deleteTask(id) {
        try {
            this._tasks = this._tasks.filter((t) => t.id !== id);
            this.saveTasks();
        }
        catch (error) {
            console.error("Failed to delete task:", error);
        }
    }
    editTask(id, content) {
        try {
            const index = this._tasks.findIndex((t) => t.id === id);
            if (index !== -1) {
                this._tasks[index] = Object.assign(Object.assign({}, content), { id }); // Ensure the id remains unchanged
                this.saveTasks();
            }
            else {
                console.warn(`Task with id ${id} not found.`);
            }
        }
        catch (error) {
            console.error("Failed to edit task:", error);
        }
    }
    getTaskById(id) {
        try {
            return this._tasks.find((t) => t.id === id);
        }
        catch (error) {
            console.error("Failed to get task by ID:", error);
            return undefined;
        }
    }
    addTask(task) {
        try {
            const newTask = Object.assign({ id: crypto.randomUUID() }, task);
            this._tasks.push(newTask);
            this.saveTasks();
        }
        catch (error) {
            console.error("Failed to add task:", error);
        }
    }
}
