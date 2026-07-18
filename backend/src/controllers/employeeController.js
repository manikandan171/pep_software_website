const Employee = require('../models/employeeModel');
const { STATUS_CODES } = require('../constants');

// Utility for basic validation
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    );
};

const validatePhone = (phone) => {
  // Simple validation for 10+ digits
  return /^\+?[\d\s-]{10,}$/.test(phone);
};

const getEmployees = (req, res) => {
  const filters = {
    name: req.query.name || '',
    department: req.query.department || '',
    status: req.query.status || ''
  };

  Employee.getAllEmployees(filters, (err, employees) => {
    if (err) {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving employees', error: err.message });
    }
    res.status(STATUS_CODES.OK).json(employees);
  });
};

const getEmployee = (req, res) => {
  const id = req.params.id;
  Employee.getEmployeeById(id, (err, employee) => {
    if (err) {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving employee', error: err.message });
    }
    if (!employee) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Employee not found' });
    }
    res.status(STATUS_CODES.OK).json(employee);
  });
};

const createEmployee = (req, res) => {
  const { fullName, email, mobileNumber, department, designation, joiningDate, status } = req.body;

  // Validation
  if (!fullName || !email || !mobileNumber || !department || !designation || !joiningDate || !status) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'All fields are required' });
  }

  if (!validateEmail(email)) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid email address' });
  }

  if (!validatePhone(mobileNumber)) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid mobile number' });
  }

  // Check if email exists
  Employee.getEmployeeByEmail(email, (err, existing) => {
    if (err) {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Database error', error: err.message });
    }
    if (existing) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Email already exists' });
    }

    Employee.createEmployee(req.body, (err, id) => {
      if (err) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Error creating employee', error: err.message });
      }
      res.status(STATUS_CODES.CREATED).json({ message: 'Employee created successfully', id });
    });
  });
};

const updateEmployee = (req, res) => {
  const id = req.params.id;
  const { fullName, email, mobileNumber, department, designation, joiningDate, status } = req.body;

  if (!fullName || !email || !mobileNumber || !department || !designation || !joiningDate || !status) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'All fields are required' });
  }

  if (!validateEmail(email)) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid email address' });
  }

  if (!validatePhone(mobileNumber)) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid mobile number' });
  }

  Employee.getEmployeeById(id, (err, employee) => {
    if (err) {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Database error', error: err.message });
    }
    if (!employee) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Employee not found' });
    }

    // Check email uniqueness if email has changed
    if (employee.email !== email) {
      Employee.getEmployeeByEmail(email, (err, existing) => {
        if (err) {
          return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Database error', error: err.message });
        }
        if (existing) {
          return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Email already exists' });
        }
        
        performUpdate(id, req.body, res);
      });
    } else {
      performUpdate(id, req.body, res);
    }
  });
};

const performUpdate = (id, data, res) => {
  Employee.updateEmployee(id, data, (err, changes) => {
    if (err) {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Error updating employee', error: err.message });
    }
    res.status(STATUS_CODES.OK).json({ message: 'Employee updated successfully' });
  });
};

const deleteEmployee = (req, res) => {
  const id = req.params.id;
  Employee.deleteEmployee(id, (err, changes) => {
    if (err) {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting employee', error: err.message });
    }
    if (changes === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Employee not found' });
    }
    res.status(STATUS_CODES.OK).json({ message: 'Employee deleted successfully' });
  });
};

const getStats = (req, res) => {
  Employee.getDashboardStats((err, stats) => {
    if (err) {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving stats', error: err.message });
    }
    res.status(STATUS_CODES.OK).json({
      total: stats.total || 0,
      active: stats.active || 0,
      inactive: stats.inactive || 0
    });
  });
};

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getStats
};
