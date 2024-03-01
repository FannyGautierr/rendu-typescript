import {Task} from "../interface/Tasks";
import CategoryManager from "./CategoryManager.js";


export default class TaskManager {
    constructor(private _tasks: Task[]) {
        //load task from localstorgae on init
        this.loadTasks()
    }

    public get tasks(): Task[] {
        return this._tasks
    }
    addTask(task: Task): void {
        const newTask: Task = {
            id: crypto.randomUUID(), 
            ...task
        };
        this.tasks.push(newTask);
        this.saveTasks()
    }

    private saveTasks(): void {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
    private loadTasks(): void {
        const tasksJson = localStorage.getItem('tasks');
        if (tasksJson) {
            this._tasks = JSON.parse(tasksJson);
        }
    }
    // ''''''''''''''''CRUD''''''''''''''''''''''''
    public deleteTask(id: string): void {
        this._tasks = this._tasks.filter((t: Task) => t.id !== id);
        this.saveTasks();
    }

    public editTask(id:string, content: Task): void{
        const index = this._tasks.findIndex((t: Task)=> t.id === id);
        this._tasks[index] = content 
        this.saveTasks();
    }

    public getTaskById(id: string): Task | undefined {
        return this._tasks.find((t: Task) => t.id === id);
    }
}
