import React from 'react';
import './ConflictModal.css';

const ConflictModal = ({ isOpen, hasConflict, onClose, onKeepDate, onReschedule }) => {
    if (!isOpen) return null;

    return (
        <div className="conflict-modal-overlay">
            <div className="conflict-modal">
                <div className="conflict-modal-header">
                    {hasConflict ? "Schedule Conflict Detected" : "Schedule Check"}
                </div>
                <div className="conflict-modal-content">
                    <div className="conflict-modal-message">
                        {hasConflict ? (
                            "There are other tasks scheduled during this time period. Would you like to keep the current date or reschedule?"
                        ) : (
                            "No scheduling conflicts found for this time period."
                        )}
                    </div>
                </div>
                <div className="conflict-modal-actions">
                    {hasConflict ? (
                        <>
                            <button 
                                className="conflict-modal-button secondary"
                                onClick={onKeepDate}
                            >
                                Keep Current Date
                            </button>
                            <button 
                                className="conflict-modal-button primary"
                                onClick={onReschedule}
                            >
                                Reschedule
                            </button>
                        </>
                    ) : (
                        <button 
                            className="conflict-modal-button primary"
                            onClick={onClose}
                        >
                            OK
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConflictModal;
