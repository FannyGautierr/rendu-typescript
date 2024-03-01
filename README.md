# Task and Category Management Application

## Overview

This application offers a comprehensive platform for managing tasks and categories, leveraging TypeScript, HTML, and `localStorage` for a smooth and persistent user experience. Users can add, edit, and delete tasks and categories. It features filtering tasks by priority, date, and category, and includes a search functionality for task titles and descriptions.

## Features

- **Task Management**: Users can create, view, edit, and delete tasks.
- **Category Management**: Allows for the addition and assignment of categories to tasks for better organization.
- **Filters and Search**: Users can filter tasks by priority, due date, and category. Additionally, a search function enables filtering by keywords in task titles and descriptions.
- **Persistence**: The application uses `localStorage` to save tasks and categories, ensuring data retention across browser sessions.
- **Interactive UI**: Implements event listeners on forms and buttons for dynamic interaction without needing to reload the page.

## Setup

To use this application, simply open the HTML file in a modern web browser or serve it using a basic web server setup. The project is structured as follows:

- `classes/`: Contains the `TaskManager` and `CategoryManager` classes for managing tasks and categories.
- `interface/`: Defines TypeScript interfaces for tasks and categories.
- Main HTML file: Where the user interface for adding, displaying, and interacting with tasks and categories is defined.

## How to Use

### Adding a Task or Category

- Complete the form for adding a task or category and submit it. Tasks require details such as title, description, priority level, due date, and an optional category. Categories need only a name.

### Editing a Task

- To edit a task, click the "Edit" button adjacent to it. This loads its details into the task form. Adjust as necessary and submit to update.

### Deleting a Task or Category

- Click the "Delete" button next to a task or category to remove it from the list.

### Filtering and Searching

- Utilize the provided filters to view tasks by priority, due date, or category. The search bar can be used to find tasks by keywords within their titles or descriptions.

## Technical Details

### Event Listeners

- The application uses event listeners for form submissions and input changes, enabling UI updates without page reloads. For efficiency, event delegation is utilized for task edit and delete actions.

### Data Persistence

- `localStorage` is employed for storing tasks and categories, with data structures initialized upon application load, ensuring user data is preserved between sessions.

### DOM Manipulation

- Dynamically adds tasks and categories to the DOM. Utility functions facilitate element creation and display management.

## Contribution

- Contributions to enhance the application or introduce new features are welcomed. Please fork the repository, make your changes, and submit a pull request.

## License

- [Specify License Here] - Inform others about how they can use or contribute to your project.
