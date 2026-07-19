import React from 'react';
import { LayoutDashboard, Users, UserPlus, Building, Briefcase, BarChart2, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Pep Software</div>

      <div className="sidebar-nav">
        <div className="nav-item active">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>
      </div>

      <div className="user-profile">
        <img src="https://ui-avatars.com/api/?name=Admin&background=111827&color=fff" alt="Admin" />
        <div className="user-profile-info">
          <p>Admin</p>
          <span>admin@pepsoftware.com</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
