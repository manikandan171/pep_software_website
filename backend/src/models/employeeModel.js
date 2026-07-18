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

  db.all(query, params, (err, rows) => {
    callback(err, rows);
  });
};

const getEmployeeById = (id, callback) => {
  const query = 'SELECT * FROM employees WHERE id = ?';
  db.get(query, [id], (err, row) => {
    callback(err, row);
  });
};

const getEmployeeByEmail = (email, callback) => {
  const query = 'SELECT * FROM employees WHERE email = ?';
  db.get(query, [email], (err, row) => {
    callback(err, row);
  });
};

const createEmployee = (employee, callback) => {
  const { fullName, email, mobileNumber, department, designation, joiningDate, status } = employee;
  const query = `
    INSERT INTO employees (fullName, email, mobileNumber, department, designation, joiningDate, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [fullName, email, mobileNumber, department, designation, joiningDate, status];
  
  // Use function() to get this.lastID
  db.run(query, params, function (err) {
    callback(err, this ? this.lastID : null);
  });
};

const updateEmployee = (id, employee, callback) => {
  const { fullName, email, mobileNumber, department, designation, joiningDate, status } = employee;
  const query = `
    UPDATE employees 
    SET fullName = ?, email = ?, mobileNumber = ?, department = ?, designation = ?, joiningDate = ?, status = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  const params = [fullName, email, mobileNumber, department, designation, joiningDate, status, id];
  
  db.run(query, params, function (err) {
    callback(err, this ? this.changes : 0);
  });
};

const deleteEmployee = (id, callback) => {
  const query = 'DELETE FROM employees WHERE id = ?';
  db.run(query, [id], function (err) {
    callback(err, this ? this.changes : 0);
  });
};

const getDashboardStats = (callback) => {
  const query = `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) as inactive
    FROM employees
  `;
  db.get(query, [], (err, row) => {
    callback(err, row);
  });
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  getEmployeeByEmail,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDashboardStats
};
