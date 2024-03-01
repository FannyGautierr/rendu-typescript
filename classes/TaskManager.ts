import {Task} from "../interface/Tasks.js";
import { Priority } from "../interface/Tasks.js";
export default class TaskManager {
    constructor(private _tasks: Task[]) {
        //load task from localstorgae on init
        this.loadTasks()
    }

    public get tasks(): Task[] {
        return this._tasks
    }
    private saveTasks(): void {
        try {
            localStorage.setItem('tasks', JSON.stringify(this._tasks));
        } catch (error) {
            console.error("Failed to save tasks:", error);
        }
    }
    private loadTasks(): void {
        try {
            const tasksJson = localStorage.getItem('tasks');
            if (tasksJson) {
                this._tasks = JSON.parse(tasksJson);
            }
        } catch (error) {
            console.error("Failed to load tasks from localStorage:", error);
        }
    }

    // random function that might be usefull
    // use the enum in the app by getting it from de task manager, might be overkilled or unnecessary dont know 
    //_________________________________________________________________________________________________________//

    public getPriorityString(priority: string): string {
        switch (priority) {
            case Priority.High: return 'high';
            case Priority.Mid: return 'medium';
            case Priority.Low: return 'low';
            default: return 'medium'; 
        }
    }
    
    public toPriority(value: string): Priority | undefined {
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
    // ''''''''''''''''CRUD''''''''''''''''''''''''
    public deleteTask(id: string): void {
        try {
            this._tasks = this._tasks.filter((t: Task) => t.id !== id);
            this.saveTasks();
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    }

    public editTask(id:string, content: Task): void{
        try {
            const index = this._tasks.findIndex((t: Task) => t.id === id);
            if (index !== -1) {
                this._tasks[index] = { ...content, id }; // Ensure the id remains unchanged
                this.saveTasks();
            } else {
                console.warn(`Task with id ${id} not found.`);
            }
        } catch (error) {
            console.error("Failed to edit task:", error);
        }
    }

    public getTaskById(id: string): Task | undefined {
        try {
            return this._tasks.find((t: Task) => t.id === id);
        } catch (error) {
            console.error("Failed to get task by ID:", error);
            return undefined;
        }
    }

    public addTask(task: Task): void {
        try {
            const newTask: Task = {
                id: crypto.randomUUID(),
                ...task
            };
            this._tasks.push(newTask);
            this.saveTasks();
        } catch (error) {
            console.error("Failed to add task:", error);
        }
    }
}
