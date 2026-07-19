const Employee = require('../models/employeeModel');
const { STATUS_CODES } = require('../constants');

const validateEmail = (email) => {
  const emailRegex = /^[a-z0-9][a-z0-9._%+-]*@[a-z0-9.-]+\.[a-z]{2,}$/;
  return emailRegex.test(String(email));
};

const validatePhone = (phone) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(String(phone));
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

    // Check if mobile number exists
    Employee.getEmployeeByMobile(mobileNumber, (err, existingMobile) => {
      if (err) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Database error', error: err.message });
      }
      if (existingMobile) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Mobile number already exists' });
      }

      Employee.createEmployee(req.body, (err, id) => {
        if (err) {
          return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Error creating employee', error: err.message });
        }
        res.status(STATUS_CODES.CREATED).json({ message: 'Employee created successfully', id });
      });
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

    const checkEmail = (cb) => {
      if (employee.email !== email) {
        Employee.getEmployeeByEmail(email, (err, existing) => {
          if (err) return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Database error', error: err.message });
          if (existing) return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Email already exists' });
          cb();
        });
      } else {
        cb();
      }
    };

    const checkMobile = (cb) => {
      if (employee.mobileNumber !== mobileNumber) {
        Employee.getEmployeeByMobile(mobileNumber, (err, existing) => {
          if (err) return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Database error', error: err.message });
          if (existing) return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Mobile number already exists' });
          cb();
        });
      } else {
        cb();
      }
    };

    checkEmail(() => {
      checkMobile(() => {
        performUpdate(id, req.body, res);
      });
    });
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
      inactive: stats.inactive || 0,
      departments: stats.departments || 0,
      totalThisMonth: stats.totalThisMonth || 0,
      activeThisMonth: stats.activeThisMonth || 0,
      inactiveThisMonth: stats.inactiveThisMonth || 0
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
