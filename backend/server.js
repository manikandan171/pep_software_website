require('dotenv').config();
const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./src/routes/employeeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/employees', employeeRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Employee Management API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
