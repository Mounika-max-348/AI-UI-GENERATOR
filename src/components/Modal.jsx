import React, { useState } from 'react';

function Modal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="modal-trigger-wrapper">
      <button 
        className="modal-trigger-btn" 
        onClick={() => setIsOpen(true)}
      >
        Open Modal
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Modal Title</h3>
              <button 
                className="modal-close" 
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>This is a modal dialog. Click outside or press the × to close.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-btn modal-btn-secondary" 
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-btn modal-btn-primary"
                onClick={() => setIsOpen(false)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Modal;