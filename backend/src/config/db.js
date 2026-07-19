const mysql = require('mysql2');

// 1. Create a temporary connection without a database to ensure the schema exists
const initialConnection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3307,
  user: 'root',
  password: '1234'
});
// 2. Create the main connection pool
const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3307,
  user: 'root',
  password: '1234',
  database: 'pep_software',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

initialConnection.query('CREATE DATABASE IF NOT EXISTS pep_software', (err) => {
  if (err) {
    console.error('Error creating database:', err.message);
  } else {
    console.log('Database pep_software ensured.');

    // After ensuring DB exists, create the table using the pool
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        mobileNumber VARCHAR(20) NOT NULL UNIQUE,
        department VARCHAR(100) NOT NULL,
        designation VARCHAR(100) NOT NULL,
        joiningDate DATE NOT NULL,
        status ENUM('Active', 'Inactive') NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;

    pool.query(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating employees table:', err.message);
      } else {
        console.log('Employees table ready in MySQL.');
      }
    });
  }
  initialConnection.end();
});

module.exports = pool;
