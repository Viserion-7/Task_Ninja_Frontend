import api from './api';

// Helper function to format dates for the API
const formatDateForAPI = (date) => {
    if (!date) return null;
    if (typeof date === 'string' && date.trim() === '') return null;
    
    // If it's already an ISO string, return it
    if (typeof date === 'string' && date.includes('T')) {
        return date;
    }
    
    // Otherwise, assume it's a date string and set time to 9 AM
    const taskDate = new Date(date);
    taskDate.setHours(9, 0, 0, 0);
    
    // Convert to UTC
    const utcDate = new Date(
        taskDate.getTime() - (taskDate.getTimezoneOffset() * 60000)
    );
    
    return utcDate.toISOString();
};

// Helper function to format dates from API
const formatDateFromAPI = (date) => {
    if (!date) return null;
    
    // For display in form inputs, we just want the date part
    return new Date(date).toISOString().split('T')[0];
};

const taskService = {
    // Get all tasks
    getAllTasks: async () => {
        const response = await api.get('/tasks/');
        return response.data;  // Return full date-time for proper display
    },

    // Get a single task by ID
    getTask: async (id) => {
        const response = await api.get(`/tasks/${id}/`);
        return response.data;  // Return full date-time for proper display
    },

    // Create a new task
    createTask: async (taskData) => {
        // Format any date fields
        const formattedTask = {
            ...taskData,
            due_date: formatDateForAPI(taskData.due_date)
        };
        console.log('Formatted task data:', formattedTask);
        const response = await api.post('/tasks/', formattedTask);
        return response.data;
    },

    // Update a task
    updateTask: async (id, taskData) => {
        // Format any date fields
        const formattedTask = {
            ...taskData,
            due_date: formatDateForAPI(taskData.due_date)
        };
        const response = await api.put(`/tasks/${id}/`, formattedTask);
        return response.data;
    },

    // Delete a task
    deleteTask: async (id) => {
        await api.delete(`/tasks/${id}/`);
    },

    // Get all subtasks for a task
    getSubtasks: async (taskId) => {
        const response = await api.get(`/subtasks/?task=${taskId}`);
        return response.data;
    },

    // Create a subtask
    createSubtask: async (subtaskData) => {
        const formattedSubtask = {
            ...subtaskData,
            due_date: formatDateForAPI(subtaskData.due_date)
        };
        const response = await api.post('/subtasks/', formattedSubtask);
        return response.data;
    },

    // Update a subtask
    updateSubtask: async (id, subtaskData) => {
        const formattedSubtask = {
            ...subtaskData,
            due_date: formatDateForAPI(subtaskData.due_date)
        };
        const response = await api.put(`/subtasks/${id}/`, formattedSubtask);
        return response.data;
    },

    // Delete a subtask
    deleteSubtask: async (id) => {
        await api.delete(`/subtasks/${id}/`);
    },

    // Get all categories
    getCategories: async () => {
        const response = await api.get('/categories/');
        return response.data;
    },

    // Create a category
    createCategory: async (categoryData) => {
        const response = await api.post('/categories/', categoryData);
        return response.data;
    },

    // Get all reminders for a task
    getReminders: async (taskId) => {
        const response = await api.get(`/reminders/?task=${taskId}`);
        return response.data;
    },

    // Create a reminder
    createReminder: async (reminderData) => {
        const response = await api.post('/reminders/', reminderData);
        return response.data;
    },

    // Update a reminder
    updateReminder: async (id, reminderData) => {
        const response = await api.put(`/reminders/${id}/`, reminderData);
        return response.data;
    },

    // Delete a reminder
    deleteReminder: async (id) => {
        await api.delete(`/reminders/${id}/`);
    }
};

export default taskService;
