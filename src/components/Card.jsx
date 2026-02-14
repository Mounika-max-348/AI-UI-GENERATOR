import React from 'react';

function Card({ title = "Card Title", children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default Card;