# Employee Management System

A full-stack Employee Management System built with React, Node.js, Express, and SQLite.

## Project Overview
This application provides a comprehensive dashboard to manage employees. It features a complete CRUD interface allowing users to view, add, edit, and delete employee records. The system provides real-time statistics (Total, Active, Inactive employees), and supports searching and filtering.

## Tech Stack
- **Frontend**: React.js (Vite), React Router, Axios, Lucide React (Icons), Vanilla CSS
- **Backend**: Node.js, Express.js, SQLite (via `sqlite3`)
- **Styling**: Modern, responsive, and premium UI with Vanilla CSS (Glassmorphism inspired, smooth animations).

## Features
- **Dashboard Metrics**: View Total, Active, and Inactive employees at a glance.
- **Employee Management**: 
  - Add new employees with detailed fields (Name, Email, Mobile, Department, Designation, Joining Date, Status).
  - Edit existing employee records.
  - Delete employees.
- **Advanced Controls**:
  - Search by employee name.
  - Filter by Department and Status.
- **Responsive Design**: Completely mobile-friendly UI.
- **Validation**: Strict server-side and client-side validation (Email formatting, Mobile numbers).

## Folder Structure

```
employee-management-system/
├── backend/
│   ├── package.json
│   ├── server.js               # Entry point
│   └── src/
│       ├── config/
│       │   └── db.js           # SQLite setup
│       ├── constants/
│       │   └── index.js
│       ├── controllers/
│       │   └── employeeController.js
│       ├── models/
│       │   └── employeeModel.js
│       └── routes/
│           └── employeeRoutes.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── index.css           # Global design system
│       ├── components/         # Reusable UI components
│       ├── pages/              # View pages
│       ├── services/           # Axios API configuration
│       └── utils/
│           └── constants.js
└── README.md
```

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)

### 1. Backend Setup
Navigate to the backend directory, install dependencies, and start the server.
```bash
cd backend
npm install
npm start
```
*Note: SQLite will automatically create the `database.sqlite` file and necessary tables on the first run.*
The backend will run on `http://localhost:5000`.

### 2. Frontend Setup
Open a new terminal window, navigate to the frontend directory, install dependencies, and start the development server.
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## API Documentation
Base URL: `http://localhost:5000/api`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/employees` | GET | Retrieve all employees (supports `name`, `department`, `status` query params) |
| `/employees/stats` | GET | Retrieve dashboard statistics (total, active, inactive) |
| `/employees/:id` | GET | Retrieve a single employee by ID |
| `/employees` | POST | Create a new employee |
| `/employees/:id` | PUT | Update an existing employee |
| `/employees/:id` | DELETE | Delete an employee |

## Application Flow
1. **Initial Load**: The frontend fetches dashboard stats and the full employee list from the backend.
2. **Adding/Editing**: Modal forms collect input. On submit, data is sent to the backend. The backend validates and executes the SQLite query. On success, the UI triggers a re-fetch.
3. **Filtering**: As the user types in the search box or changes dropdowns, API requests are debounced and sent with query parameters, updating the table instantly.

## Assumptions
- SQLite was chosen as the database to provide a zero-setup, immediately runnable local environment without requiring the installation of MongoDB/MySQL services on the host machine.
- Employee mobile number validation assumes generic minimum 10 digits/characters including spaces and hyphens.

## Deployment & GitHub
To deploy this application:
1. **GitHub**: Run `git init`, `git add .`, `git commit -m "Initial commit"`, then `git remote add origin <your-repo-url>` and `git push -u origin main`.
2. **Frontend Deployment**: Use Vercel or Netlify by pointing them to the `/frontend` directory.
3. **Backend Deployment**: Use Render or Railway by pointing them to the `/backend` directory. (Note: For persistent data in production, switch SQLite to PostgreSQL or MongoDB by updating `config/db.js` and `models/employeeModel.js`).
