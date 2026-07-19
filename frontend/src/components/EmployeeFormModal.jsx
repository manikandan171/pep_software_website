import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building2, Briefcase, Calendar } from 'lucide-react';
import { DEPARTMENTS, STATUS_OPTIONS } from '../utils/constants';

const EmployeeFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const defaultState = {
    fullName: '',
    email: '',
    mobileNumber: '',
    department: '',
    designation: '',
    joiningDate: '',
    status: STATUS_OPTIONS.ACTIVE
  };

  const [formData, setFormData] = useState(defaultState);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [validationSuccess, setValidationSuccess] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRegex = /^[a-z0-9][a-z0-9._%+-]*@[a-z0-9.-]+\.[a-z]{2,}$/;
  const mobileRegex = /^[6-9]\d{9}$/;

  useEffect(() => {
    setError('');
    setValidationErrors({});
    setValidationSuccess({});
    if (initialData) {
      const formattedData = { ...initialData };
      if (formattedData.joiningDate) {
        const d = new Date(formattedData.joiningDate);
        if (!isNaN(d.getTime())) {
          formattedData.joiningDate = d.toISOString().split('T')[0];
        }
      }
      setFormData(formattedData);
    } else {
      setFormData(defaultState);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Clear any default HTML5 validation messages so we can use our custom ones
    e.target.setCustomValidity('');

    if (name === 'email') {
      value = value.toLowerCase();
    }

    if (name === 'fullName') {
      // Instantly strip out any numbers or special characters (only allow letters and spaces)
      value = value.replace(/[^A-Za-z\s]/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: value }));

    // Realtime validation
    if (name === 'email') {
      if (value && !emailRegex.test(value)) {
        setValidationErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      } else {
        setValidationErrors(prev => ({ ...prev, email: '' }));
      }
    }

    if (name === 'mobileNumber') {
      if (value && !mobileRegex.test(value)) {
        setValidationErrors(prev => ({ ...prev, mobileNumber: 'Provide the valid 10-digit number' }));
      } else {
        setValidationErrors(prev => ({ ...prev, mobileNumber: '' }));
      }
    }

    if (name === 'fullName') {
      if (value && value.trim().length < 4) {
        setValidationErrors(prev => ({ ...prev, fullName: 'Name must be at least 4 characters long' }));
        setValidationSuccess(prev => ({ ...prev, fullName: '' }));
      } else {
        setValidationErrors(prev => ({ ...prev, fullName: '' }));
        setValidationSuccess(prev => ({ ...prev, fullName: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Something went wrong';
      if (errMsg.toLowerCase().includes('mobile number already exists')) {
        setValidationErrors(prev => ({ ...prev, mobileNumber: 'Number is already taken' }));
      } else if (errMsg.toLowerCase().includes('email already exists')) {
        setValidationErrors(prev => ({ ...prev, email: 'Email is already taken' }));
        setValidationSuccess(prev => ({ ...prev, email: '' }));
      } else {
        setError(errMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-header-text">
            <h2>{initialData ? 'Edit Employee' : 'Add New Employee'}</h2>
            <p className="modal-subtitle">Fill in the employee details to {initialData ? 'update' : 'add to'} the system</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
            {[
              {
                name: 'fullName',
                label: 'Full Name',
                icon: User,
                placeholder: 'Enter full name',
                fullWidth: true,
                error: validationErrors.fullName,
                success: validationSuccess.fullName,
                onInvalid: (e) => e.target.setCustomValidity('Please enter a valid full name (letters only)')
              },
              { name: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'Enter email address', pattern: '^[a-z0-9][a-z0-9._%+-]*@[a-z0-9.-]+\\.[a-z]{2,}$', title: 'Please enter a valid lowercase email address starting with a letter or number', error: validationErrors.email, success: validationSuccess.email },
              { name: 'mobileNumber', label: 'Mobile Number', icon: Phone, placeholder: 'Enter mobile number', pattern: '^[6-9]\\d{9}$', title: 'Please enter a valid 10-digit mobile number starting with 6-9', error: validationErrors.mobileNumber, maxLength: 10 },
              { name: 'department', label: 'Department', icon: Building2, type: 'select', options: DEPARTMENTS },
              { name: 'designation', label: 'Designation', icon: Briefcase, placeholder: 'Enter designation' },
              { name: 'joiningDate', label: 'Joining Date', icon: Calendar, type: 'date' },
              {
                name: 'status', label: 'Status', type: 'select', options: [
                  { value: STATUS_OPTIONS.ACTIVE, label: STATUS_OPTIONS.ACTIVE, style: { color: '#22c55e', fontWeight: 'bold' } },
                  { value: STATUS_OPTIONS.INACTIVE, label: STATUS_OPTIONS.INACTIVE, style: { color: '#ef4444', fontWeight: 'bold' } }
                ], customIcon: <div className="input-icon" style={{ width: '8px', height: '8px', borderRadius: '50%', background: formData.status === STATUS_OPTIONS.ACTIVE ? '#22c55e' : '#ef4444', left: '1.25rem' }} />
              }
            ].map(f => (
              <div key={f.name} className="form-group" style={f.fullWidth ? { gridColumn: '1 / -1' } : {}}>
                <label>{f.label}</label>
                <div className="input-with-icon">
                  {f.customIcon ? f.customIcon : <f.icon className="input-icon" size={18} />}
                  {f.type === 'select' ? (
                    <select name={f.name} className="form-control with-icon" required value={formData[f.name]} onChange={handleChange} style={f.name === 'status' ? { color: formData.status === STATUS_OPTIONS.ACTIVE ? '#22c55e' : '#ef4444', fontWeight: '500' } : {}}>
                      {f.placeholder && <option value="" disabled>{f.placeholder}</option>}
                      {f.options.map(o => (
                        typeof o === 'string'
                          ? <option key={o} value={o}>{o}</option>
                          : <option key={o.value} value={o.value} style={o.style}>{o.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type || 'text'}
                      name={f.name}
                      className="form-control with-icon"
                      placeholder={f.placeholder}
                      required
                      pattern={f.pattern}
                      title={f.title}
                      maxLength={f.maxLength}
                      value={formData[f.name]}
                      onChange={handleChange}
                      onInvalid={f.onInvalid}
                    />
                  )}
                </div>
                {f.error && <div style={{ color: 'var(--danger-text)', fontSize: '0.75rem', marginTop: '0.25rem', paddingLeft: '0.25rem' }}>{f.error}</div>}
                {f.success && !f.error && <div style={{ color: '#22c55e', fontSize: '0.75rem', marginTop: '0.25rem', paddingLeft: '0.25rem' }}>{f.success}</div>}
              </div>
            ))}

            {error && <div style={{ gridColumn: '1 / -1', color: 'red', fontSize: '0.875rem' }}>{error}</div>}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || validationErrors.email || validationErrors.mobileNumber || validationErrors.fullName}
              style={{ opacity: (isSubmitting || validationErrors.email || validationErrors.mobileNumber || validationErrors.fullName) ? 0.6 : 1 }}
            >
              {isSubmitting ? 'Saving...' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;
