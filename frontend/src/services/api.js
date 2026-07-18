import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getEmployees = async (filters = {}) => {
  const { name, department, status } = filters;
  const params = new URLSearchParams();
  if (name) params.append('name', name);
  if (department) params.append('department', department);
  if (status) params.append('status', status);

  const response = await api.get(`/employees?${params.toString()}`);
  return response.data;
};

export const getEmployeeById = async (id) => {
  const response = await api.get(`/employees/${id}`);
  return response.data;
};

export const createEmployee = async (employeeData) => {
  const response = await api.post('/employees', employeeData);
  return response.data;
};

export const updateEmployee = async (id, employeeData) => {
  const response = await api.put(`/employees/${id}`, employeeData);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await api.delete(`/employees/${id}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/employees/stats');
  return response.data;
};

export default api;
