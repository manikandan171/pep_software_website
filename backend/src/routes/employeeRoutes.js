const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Routes
router.get('/stats', employeeController.getStats);
router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.getEmployee);
router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
