export default class TaskManager {
    constructor(_tasks) {
        this._tasks = _tasks;
        //load task from localstorgae on init
        this.loadTasks();
    }
    get tasks() {
        return this._tasks;
    }
    addTask(task) {
        const newTask = Object.assign({ id: crypto.randomUUID() }, task);
        this.tasks.push(newTask);
        this.saveTasks();
    }
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
    loadTasks() {
        const tasksJson = localStorage.getItem('tasks');
        if (tasksJson) {
            this._tasks = JSON.parse(tasksJson);
        }
    }
    // ''''''''''''''''CRUD''''''''''''''''''''''''
    deleteTask(id) {
        this._tasks = this._tasks.filter((t) => t.id !== id);
        this.saveTasks();
    }
    editTask(id, content) {
        const index = this._tasks.findIndex((t) => t.id === id);
        this._tasks[index] = content;
        this.saveTasks();
    }
    getTaskById(id) {
        return this._tasks.find((t) => t.id === id);
    }
}
