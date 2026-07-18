import React from 'react';
import { Users, UserCheck, UserMinus } from 'lucide-react';

const DashboardCards = ({ stats }) => {
  return (
    <div className="dashboard-grid">
      <div className="stat-card">
        <div className="stat-icon total">
          <Users size={24} />
        </div>
        <div className="stat-info">
          <h3>Total Employees</h3>
          <p>{stats.total}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon active">
          <UserCheck size={24} />
        </div>
        <div className="stat-info">
          <h3>Active Employees</h3>
          <p>{stats.active}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon inactive">
          <UserMinus size={24} />
        </div>
        <div className="stat-info">
          <h3>Inactive Employees</h3>
          <p>{stats.inactive}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
