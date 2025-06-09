import React, { useState, useEffect } from 'react';
import { FaRegCheckCircle, FaUndo, FaTimes } from 'react-icons/fa';
import taskService from '../../services/taskService';
import api from '../../services/api';
import './SubtaskSidebar.css';

const SubtaskSidebar = ({ isOpen, task, onClose, onSubtaskChange }) => {
    const [subtasks, setSubtasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubtasks = async () => {
        if (!task) return;
        try {
            setLoading(true);
            const response = await api.get(`/tasks/${task.id}/subtasks/`);
            setSubtasks(response.data);
        } catch (err) {
            setError('Failed to load subtasks');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

        if (isOpen && task) {
            fetchSubtasks();
        }
    }, [isOpen, task]);

    const handleComplete = async (subtask) => {
        try {
            await taskService.updateSubtask(subtask.id, {
                ...subtask,
                is_completed: !subtask.is_completed
            });
            await fetchSubtasks();
            if (onSubtaskChange) onSubtaskChange();
        } catch (err) {
            setError('Failed to update subtask');
            console.error(err);
        }
    };

    const SubtaskItem = ({ subtask }) => (
        <div className={`subtask-item ${subtask.is_completed ? 'completed' : ''}`}>
            <div className="subtask-content">
                <div className="subtask-title">{subtask.title}</div>
                <div className="subtask-duration">{subtask.minutes} minutes</div>
            </div>
            <div className="subtask-actions">
                <button 
                    className="subtask-btn complete" 
                    onClick={() => handleComplete(subtask)}
                    title={subtask.is_completed ? "Mark as incomplete" : "Mark as complete"}
                >
                    {subtask.is_completed ? <FaUndo /> : <FaRegCheckCircle />}
                </button>
            </div>
        </div>
    );

    return (
        <div className={`subtask-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="subtask-header">
                <h2>Subtasks for {task?.title}</h2>
                <button className="close-sidebar" onClick={onClose}><FaTimes /></button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {loading ? (
                <div>Loading subtasks...</div>
            ) : (
                <div className="subtask-list">
                    {subtasks.length > 0 ? (
                        subtasks.map(subtask => (
                            <SubtaskItem key={subtask.id} subtask={subtask} />
                        ))
                    ) : (
                        <div>No subtasks found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SubtaskSidebar;
