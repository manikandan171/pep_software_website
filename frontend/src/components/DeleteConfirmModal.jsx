import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, employeeName, isSubmitting }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header" style={{ paddingBottom: '1rem', borderBottom: 'none' }}>
          <div className="modal-header-text">
            <h2 style={{ color: '#f59e0b' }}>Delete Employee</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} disabled={isSubmitting}>
            <X size={18} />
          </button>
        </div>
        
        <div className="modal-body" style={{ textAlign: 'center', padding: '1rem 1rem 2rem 1rem' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', marginBottom: '1rem' }}>
            <AlertTriangle size={30} />
          </div>
          <h3 style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Are you sure?</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Do you really want to delete <strong>{employeeName || 'this employee'}</strong>? This action cannot be undone.
          </p>
        </div>
        
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <button type="button" className="btn-outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn-primary" 
            style={{ backgroundColor: '#f59e0b', borderColor: '#f59e0b', color: '#fff' }}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
