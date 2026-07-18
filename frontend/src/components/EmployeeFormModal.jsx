import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { DEPARTMENTS, STATUS_OPTIONS } from '../utils/constants';

const EmployeeFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const defaultState = {
    fullName: '',
    email: '',
    mobileNumber: '',
    department: DEPARTMENTS[0],
    designation: '',
    joiningDate: '',
    status: STATUS_OPTIONS.ACTIVE
  };

  const [formData, setFormData] = useState(defaultState);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultState);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{initialData ? 'Edit Employee' : 'Add Employee'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body form-grid">
            <div className="input-group">
              <label>Full Name *</label>
              <input 
                type="text" 
                name="fullName" 
                className="input-control" 
                required 
                value={formData.fullName} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="input-group">
              <label>Email Address *</label>
              <input 
                type="email" 
                name="email" 
                className="input-control" 
                required 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="input-group">
              <label>Mobile Number *</label>
              <input 
                type="text" 
                name="mobileNumber" 
                className="input-control" 
                required 
                value={formData.mobileNumber} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="input-group">
              <label>Department *</label>
              <select 
                name="department" 
                className="input-control" 
                required 
                value={formData.department} 
                onChange={handleChange}
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div className="input-group">
              <label>Designation *</label>
              <input 
                type="text" 
                name="designation" 
                className="input-control" 
                required 
                value={formData.designation} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="input-group">
              <label>Joining Date *</label>
              <input 
                type="date" 
                name="joiningDate" 
                className="input-control" 
                required 
                value={formData.joiningDate} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="input-group">
              <label>Status *</label>
              <select 
                name="status" 
                className="input-control" 
                required 
                value={formData.status} 
                onChange={handleChange}
              >
                <option value={STATUS_OPTIONS.ACTIVE}>{STATUS_OPTIONS.ACTIVE}</option>
                <option value={STATUS_OPTIONS.INACTIVE}>{STATUS_OPTIONS.INACTIVE}</option>
              </select>
            </div>

            {error && (
              <div className="full-width">
                <p className="error-text">{error}</p>
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;
