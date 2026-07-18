const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      mobileNumber TEXT NOT NULL,
      department TEXT NOT NULL,
      designation TEXT NOT NULL,
      joiningDate TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('Active', 'Inactive')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating employees table:', err.message);
    } else {
      console.log('Employees table ready.');
    }
  });
}

module.exports = db;
