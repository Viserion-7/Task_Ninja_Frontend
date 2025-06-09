import React, { useState, useEffect } from "react";
import "./Toast.css";

const Toast = ({ show, title, message, onClose, onAction, actionText }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!show) {
      setIsExiting(false);
    }
  }, [show]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  if (!show) return null;

  return (
    <div className="toast-container">
      <div className={`toast overdue ${isExiting ? "toast-exit" : ""}`}>
        <div className="toast-content">
          <div className="toast-title">{title}</div>
          <div className="toast-message">{message}</div>
        </div>
        <div className="toast-actions">
          {actionText && (
            <button
              className="toast-button toast-reschedule"
              onClick={onAction}
            >
              {actionText}
            </button>
          )}
          <button className="toast-button toast-close" onClick={handleClose}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export { Toast };
