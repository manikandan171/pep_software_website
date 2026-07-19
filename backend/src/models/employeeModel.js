const db = require('../config/db');

const getAllEmployees = (filters, callback) => {
  let query = 'SELECT * FROM employees WHERE 1=1';
  const params = [];

  if (filters.name) {
    query += ' AND fullName LIKE ?';
    params.push(`%${filters.name}%`);
  }
  if (filters.department) {
    query += ' AND department = ?';
    params.push(filters.department);
  }
  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }

  query += ' ORDER BY createdAt DESC';

  db.query(query, params, (err, rows) => {
    callback(err, rows);
  });
};

const getEmployeeById = (id, callback) => {
  const query = 'SELECT * FROM employees WHERE id = ?';
  db.query(query, [id], (err, rows) => {
    if (err) return callback(err, null);
    callback(null, rows.length > 0 ? rows[0] : null);
  });
};

const getEmployeeByEmail = (email, callback) => {
  const query = 'SELECT * FROM employees WHERE email = ?';
  db.query(query, [email], (err, rows) => {
    if (err) return callback(err, null);
    callback(null, rows.length > 0 ? rows[0] : null);
  });
};

const getEmployeeByMobile = (mobile, callback) => {
  const query = 'SELECT * FROM employees WHERE mobileNumber = ?';
  db.query(query, [mobile], (err, rows) => {
    if (err) return callback(err, null);
    callback(null, rows.length > 0 ? rows[0] : null);
  });
};

const createEmployee = (employee, callback) => {
  const { fullName, email, mobileNumber, department, designation, joiningDate, status } = employee;
  const query = `
    INSERT INTO employees (fullName, email, mobileNumber, department, designation, joiningDate, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [fullName, email, mobileNumber, department, designation, joiningDate, status];
  
  db.query(query, params, (err, result) => {
    if (err) return callback(err, null);
    callback(null, result.insertId);
  });
};

const updateEmployee = (id, employee, callback) => {
  const { fullName, email, mobileNumber, department, designation, joiningDate, status } = employee;
  const query = `
    UPDATE employees 
    SET fullName = ?, email = ?, mobileNumber = ?, department = ?, designation = ?, joiningDate = ?, status = ?
    WHERE id = ?
  `;
  const params = [fullName, email, mobileNumber, department, designation, joiningDate, status, id];
  
  db.query(query, params, (err, result) => {
    if (err) return callback(err, 0);
    callback(null, result.affectedRows);
  });
};

const deleteEmployee = (id, callback) => {
  const query = 'DELETE FROM employees WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return callback(err, 0);
    callback(null, result.affectedRows);
  });
};

const getDashboardStats = (callback) => {
  const query = `
    SELECT 
      COUNT(*) as total,
      COALESCE(SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END), 0) as active,
      COALESCE(SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END), 0) as inactive,
      COUNT(DISTINCT department) as departments,
      COALESCE(SUM(CASE WHEN MONTH(createdAt) = MONTH(CURRENT_DATE()) AND YEAR(createdAt) = YEAR(CURRENT_DATE()) THEN 1 ELSE 0 END), 0) as totalThisMonth,
      COALESCE(SUM(CASE WHEN status = 'Active' AND MONTH(createdAt) = MONTH(CURRENT_DATE()) AND YEAR(createdAt) = YEAR(CURRENT_DATE()) THEN 1 ELSE 0 END), 0) as activeThisMonth,
      COALESCE(SUM(CASE WHEN status = 'Inactive' AND MONTH(createdAt) = MONTH(CURRENT_DATE()) AND YEAR(createdAt) = YEAR(CURRENT_DATE()) THEN 1 ELSE 0 END), 0) as inactiveThisMonth
    FROM employees
  `;
  db.query(query, [], (err, rows) => {
    if (err) return callback(err, null);
    callback(null, rows.length > 0 ? rows[0] : null);
  });
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  getEmployeeByEmail,
  getEmployeeByMobile,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDashboardStats
};
