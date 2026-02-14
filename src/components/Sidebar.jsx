import React from 'react';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Navigation</h3>
      </div>
      <ul className="sidebar-menu">
        <li className="sidebar-item active">
          <span className="sidebar-icon">🏠</span>
          <span className="sidebar-text">Dashboard</span>
        </li>
        <li className="sidebar-item">
          <span className="sidebar-icon">📊</span>
          <span className="sidebar-text">Analytics</span>
        </li>
        <li className="sidebar-item">
          <span className="sidebar-icon">⚙️</span>
          <span className="sidebar-text">Settings</span>
        </li>
        <li className="sidebar-item">
          <span className="sidebar-icon">👤</span>
          <span className="sidebar-text">Profile</span>
        </li>
        <li className="sidebar-item">
          <span className="sidebar-icon">📝</span>
          <span className="sidebar-text">Documents</span>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;