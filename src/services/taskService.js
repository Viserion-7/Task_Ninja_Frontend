import api from './api';

const taskService = {
    // Get all tasks
    getAllTasks: async () => {
        const response = await api.get('/tasks/');
        return response.data;
    },

    // Create a new task
    createTask: async (taskData) => {
        const response = await api.post('/tasks/', {
            title: taskData.title,
            description: taskData.description,
            due_date: taskData.due_date,
            priority: taskData.priority,
            category: taskData.category
        });
        return response.data;
    },

    // Create a subtask directly
    createSubtask: async (taskId, subtaskData) => {
        const response = await api.post('/subtasks/', {
            task: taskId,
            title: subtaskData.title,
            minutes: parseInt(subtaskData.duration) || 30,
            is_completed: false
        });
        return response.data;
    },

    // Update task
    updateTask: async (taskId, taskData) => {
        const response = await api.put(`/tasks/${taskId}/`, taskData);
        return response.data;
    },

    // Delete task
    deleteTask: async (taskId) => {
        await api.delete(`/tasks/${taskId}/`);
    },

    // Mark task as complete
    completeTask: async (taskId) => {
        const response = await api.post(`/tasks/${taskId}/complete/`);
        return response.data;
    },

    // Get task categories
    getCategories: async () => {
        const response = await api.get('/categories/');
        return response.data;
    },

    // Get all subtasks
    getSubtasks: async () => {
        const response = await api.get('/subtasks/');
        return response.data;
    }
};

export default taskService;
