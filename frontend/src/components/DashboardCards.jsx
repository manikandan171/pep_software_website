import React from 'react';
import { Users, UserCheck, UserMinus, Building2 } from 'lucide-react';
import { DEPARTMENTS } from '../utils/constants';

const DashboardCards = ({ stats }) => {
  const activePercentage = stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(2) : 0;
  const inactivePercentage = stats.total > 0 ? ((stats.inactive / stats.total) * 100).toFixed(2) : 0;

  return (
    <>
      <div className="stat-cards-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper yellow">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Employees</h3>
            <h2>{stats.total}</h2>
            <div className={`stat-trend ${stats.totalThisMonth > 0 ? 'up' : ''}`}>
              {stats.totalThisMonth > 0 ? '\u2191' : ''} {stats.totalThisMonth || 0} <span>this month</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <h3>Active Employees</h3>
            <h2>{stats.active}</h2>
            <div className={`stat-trend ${stats.activeThisMonth > 0 ? 'up' : ''}`}>
              {stats.activeThisMonth > 0 ? '\u2191' : ''} {stats.activeThisMonth || 0} <span>this month</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper red">
            <UserMinus size={24} />
          </div>
          <div className="stat-info">
            <h3>Inactive Employees</h3>
            <h2>{stats.inactive}</h2>
            <div className={`stat-trend ${stats.inactiveThisMonth > 0 ? 'down' : ''}`}>
              {stats.inactiveThisMonth > 0 ? '\u2193' : ''} {stats.inactiveThisMonth || 0} <span>this month</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Building2 size={24} />
          </div>
          <div className="stat-info">
            <h3>Departments</h3>
            <h2>{stats.departments || 0}</h2>
            <div className="stat-trend" style={{ color: 'var(--text-muted)' }}>
              Total Departments
            </div>
          </div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-item" style={{ minWidth: '100px' }}>
          <span className="progress-label">Total</span>
          <div className="progress-pill-dark">{stats.total}</div>
        </div>
        
        <div className="progress-bar-container">
          <div className="progress-item" style={{ flexGrow: activePercentage }}>
            <span className="progress-label">Active</span>
            <div className="progress-pill-yellow">{activePercentage}%</div>
          </div>
          <div className="progress-item" style={{ flexGrow: inactivePercentage }}>
            <span className="progress-label">Inactive</span>
            <div className="progress-pill-light">{inactivePercentage}%</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardCards;
