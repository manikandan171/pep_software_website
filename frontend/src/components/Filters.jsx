import React from 'react';
import { Search } from 'lucide-react';
import { DEPARTMENTS, STATUS_OPTIONS } from '../utils/constants';

const Filters = ({ filters, onFilterChange }) => {
  return (
    <div className="controls-container">
      <div className="input-group search-input">
        <label>Search Employees</label>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="input-control"
            placeholder="Search by name..."
            style={{ paddingLeft: '2.5rem', width: '100%' }}
            value={filters.name}
            onChange={(e) => onFilterChange('name', e.target.value)}
          />
        </div>
      </div>

      <div className="input-group filter-select">
        <label>Department</label>
        <select
          className="input-control"
          value={filters.department}
          onChange={(e) => onFilterChange('department', e.target.value)}
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div className="input-group filter-select">
        <label>Status</label>
        <select
          className="input-control"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value={STATUS_OPTIONS.ACTIVE}>{STATUS_OPTIONS.ACTIVE}</option>
          <option value={STATUS_OPTIONS.INACTIVE}>{STATUS_OPTIONS.INACTIVE}</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
