import React from 'react';

function Button({ text = "Click Me" }) {
  return (
    <button className="component-button">
      {text}
    </button>
  );
}

export default Button;