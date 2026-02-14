import React from 'react';

function Input() {
  return (
    <div className="input-wrapper">
      <label className="input-label">Enter your text</label>
      <input 
        type="text" 
        className="component-input" 
        placeholder="Type something..."
      />
    </div>
  );
}

export default Input;