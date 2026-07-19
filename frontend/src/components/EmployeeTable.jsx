import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset page when filters change (employees array changes)
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [employees]);

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getStatusClass = (status) => {
    return status === 'Active' ? 'badge-active' : 'badge-inactive';
  };

  // Pagination logic
  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = employees.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input type="checkbox" style={{ cursor: 'pointer' }} />
              </th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Joining Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((emp) => (
                <tr 
                  key={emp.id} 
                  className={selectedIds.includes(emp.id) ? 'selected' : ''}
                >
                  <td>
                    <input 
                      type="checkbox" 
                      style={{ cursor: 'pointer' }}
                      checked={selectedIds.includes(emp.id)}
                      onChange={() => toggleSelect(emp.id)}
                    />
                  </td>
                  <td>
                    <div className="employee-name-cell">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.fullName)}&background=random`} 
                        alt="avatar" 
                        className="avatar" 
                      />
                      {emp.fullName}
                    </div>
                  </td>
                  <td>{emp.email}</td>
                  <td>{emp.mobileNumber}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>{formatDate(emp.joiningDate)}</td>
                  <td>
                    <span className={`badge ${getStatusClass(emp.status)}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-circle edit" onClick={() => onEdit(emp)} title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button className="action-circle delete" onClick={() => onDelete(emp)} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No employees found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      {employees.length > 0 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, employees.length)} of {employees.length} entries
          </div>
          <div className="pagination-controls">
            <button className="page-btn" onClick={handlePrevPage} disabled={currentPage === 1}>
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page} 
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            
            <button className="page-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeTable;
