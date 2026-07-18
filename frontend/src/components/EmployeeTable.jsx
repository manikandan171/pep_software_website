import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
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
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.fullName}</td>
                <td>{emp.email}</td>
                <td>{emp.mobileNumber}</td>
                <td>{emp.department}</td>
                <td>{emp.designation}</td>
                <td>{emp.joiningDate}</td>
                <td>
                  <span className={`status-badge ${emp.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                    {emp.status}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="icon-btn edit" onClick={() => onEdit(emp)} title="Edit">
                      <Pencil size={18} />
                    </button>
                    <button className="icon-btn delete" onClick={() => onDelete(emp.id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
