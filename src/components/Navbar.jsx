import React from 'react';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-text">My App</span>
      </div>
      <ul className="navbar-menu">
        <li className="navbar-item">Home</li>
        <li className="navbar-item">About</li>
        <li className="navbar-item">Services</li>
        <li className="navbar-item">Contact</li>
      </ul>
      <div className="navbar-actions">
        <button className="navbar-btn">Login</button>
      </div>
    </nav>
  );
}

export default Navbar;