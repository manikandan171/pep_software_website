import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import DashboardCards from '../components/DashboardCards';
import EmployeeTable from '../components/EmployeeTable';
import Filters from '../components/Filters';
import EmployeeFormModal from '../components/EmployeeFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { getEmployees, getDashboardStats, createEmployee, updateEmployee, deleteEmployee } from '../services/api';

const Home = () => {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', department: '', status: '' });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
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

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (employeeToDelete) {
      setIsDeleting(true);
      try {
        await deleteEmployee(employeeToDelete.id);
        fetchData();
        setDeleteModalOpen(false);
        setEmployeeToDelete(null);
      } catch (error) {
        console.error('Error deleting employee', error);
        alert('Failed to delete employee');
      } finally {
        setIsDeleting(false);
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

  const handleExportClick = () => {
    if (employees.length === 0) return alert('No data to export');
    
    const headers = ['ID', 'Full Name', 'Email', 'Mobile', 'Department', 'Designation', 'Joining Date', 'Status'];
    const csvRows = employees.map(emp => {
      return [
        emp.id,
        `"${emp.fullName}"`,
        `"${emp.email}"`,
        `"${emp.mobileNumber}"`,
        `"${emp.department}"`,
        `"${emp.designation}"`,
        `"${(emp.joiningDate || '').split('T')[0]}"`,
        `"${emp.status}"`
      ].join(',');
    });
    
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employees_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      
      <main className="main-content">
        <TopHeader />
        
        <DashboardCards stats={stats} />
        
        <section className="content-section">
          <Filters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            onAdd={handleAddClick} 
            onExport={handleExportClick}
          />
          
          <EmployeeTable 
            employees={employees} 
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </section>
      </main>

      <EmployeeFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingEmployee}
      />

      <DeleteConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setEmployeeToDelete(null); }}
        onConfirm={confirmDelete}
        employeeName={employeeToDelete?.fullName}
        isSubmitting={isDeleting}
      />
    </div>
  );
};

export default Home;
