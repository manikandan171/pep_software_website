import React from 'react';
import { Search, Download, Plus, RotateCcw } from 'lucide-react';
import { DEPARTMENTS, STATUS_OPTIONS } from '../utils/constants';

const Filters = ({ filters, onFilterChange, onAdd, onExport }) => {
  const handleReset = () => {
    onFilterChange('name', '');
    onFilterChange('department', '');
    onFilterChange('status', '');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      <div className="content-header">
        <h2>Employee List</h2>
        <div className="content-actions">
          <button className="btn-yellow" onClick={onAdd}>
            <Plus size={16} /> Add Employee
          </button>
          <button className="btn-outline-small" onClick={onExport} title="Export to CSV">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="filters-row">
        <div className="filter-input-wrap">
          <Search size={18} />
          <input 
            type="text" 
            className="filter-input" 
            placeholder="Search by name..." 
            value={filters.name}
            onChange={(e) => onFilterChange('name', e.target.value)}
          />
        </div>
        
        <select 
          className="filter-select"
          value={filters.department}
          onChange={(e) => onFilterChange('department', e.target.value)}
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        
        <select 
          className="filter-select"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="">All Status</option>
          <option value={STATUS_OPTIONS.ACTIVE}>{STATUS_OPTIONS.ACTIVE}</option>
          <option value={STATUS_OPTIONS.INACTIVE}>{STATUS_OPTIONS.INACTIVE}</option>
        </select>

        <button className="btn-reset" onClick={handleReset} title="Reset Filters">
          Reset
        </button>
      </div>
    </div>
  );
};

export default Filters;
