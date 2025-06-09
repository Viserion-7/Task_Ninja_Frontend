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

    // Get subtasks for a task
    getSubtasks: async (taskId) => {
        const response = await api.get(`/tasks/${taskId}/subtasks/`);
        return response.data;
    },

    // Update subtask
    updateSubtask: async (subtaskId, subtaskData) => {
        const response = await api.put(`/subtasks/${subtaskId}/`, {
            ...subtaskData,
            minutes: parseInt(subtaskData.minutes) || 30
        });
        return response.data;
    },

    // Delete subtask
    deleteSubtask: async (subtaskId) => {
        await api.delete(`/subtasks/${subtaskId}/`);
    },

    // Complete subtask
    completeSubtask: async (subtaskId) => {
        const response = await api.put(`/subtasks/${subtaskId}/`, {
            is_completed: true
        });
        return response.data;
    },

    // Check for schedule conflicts
    checkConflicts: async (dueDate) => {
        try {
            // First get all tasks for the same date
            const tasks = await taskService.getAllTasks();
            
            // Convert due date to Date object for comparison
            const newTaskDate = new Date(dueDate);
            
            // Find tasks on the same day
            const conflictingTasks = tasks.filter(task => {
                if (!task.due_date) return false;
                
                const taskDate = new Date(task.due_date);
                
                // Check if dates are on the same day
                return taskDate.getFullYear() === newTaskDate.getFullYear() &&
                       taskDate.getMonth() === newTaskDate.getMonth() &&
                       taskDate.getDate() === newTaskDate.getDate() &&
                       !task.is_completed;
            });

            return conflictingTasks.length > 0;
        } catch (err) {
            console.error('Error checking conflicts:', err);
            return false;
        }
    },

    // Reschedule task by adding days
    rescheduleTask: async (taskId, daysToAdd = 1) => {
        const task = await api.get(`/tasks/${taskId}/`);
        const currentDueDate = new Date(task.data.due_date);
        const newDueDate = new Date(currentDueDate.setDate(currentDueDate.getDate() + daysToAdd));
        
        const response = await api.put(`/tasks/${taskId}/`, {
            ...task.data,
            due_date: newDueDate.toISOString()
        });
        return response.data;
    },

    // Check if a task is overdue
    isTaskOverdue: (task) => {
        if (task.is_completed) return false;
        const dueDate = new Date(task.due_date);
        const now = new Date();
        return dueDate < now;
    }
};

export default taskService;
