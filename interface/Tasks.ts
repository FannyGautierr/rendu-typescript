// task Interface
import { Category } from "./Categories"


// interface for task and enum for priority because it will never changed
export interface Task{
    title: string,
    description: string,
    end_date: number,
    priority: Priority,
    category?: Category, 
    id?:string
}

export enum Priority {
    High = "High",
    Mid = "Mid",
    Low = "Low"
}