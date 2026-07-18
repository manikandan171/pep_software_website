import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import DashboardCards from '../components/DashboardCards';
import EmployeeTable from '../components/EmployeeTable';
import Filters from '../components/Filters';
import EmployeeFormModal from '../components/EmployeeFormModal';
import { getEmployees, getDashboardStats, createEmployee, updateEmployee, deleteEmployee } from '../services/api';

const Home = () => {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', department: '', status: '' });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [employeesData, statsData] = await Promise.all([
        getEmployees(filters),
        getDashboardStats()
      ]);
      setEmployees(employeesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data', error);
      alert('Failed to load data. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // Debounce the fetching when typing in search
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAddClick = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting employee', error);
        alert('Failed to delete employee');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    if (editingEmployee) {
      await updateEmployee(editingEmployee.id, formData);
    } else {
      await createEmployee(formData);
    }
    fetchData(); // Refresh data
  };

  return (
    <div className="container">
      <header className="page-header">
        <h1 className="title">Employee Management</h1>
        <button className="btn btn-primary" onClick={handleAddClick}>
          <Plus size={18} />
          Add Employee
        </button>
      </header>

      <DashboardCards stats={stats} />
      
      <Filters filters={filters} onFilterChange={handleFilterChange} />
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading employees...
        </div>
      ) : (
        <EmployeeTable 
          employees={employees} 
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      <EmployeeFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingEmployee}
      />
    </div>
  );
};

export default Home;
