import React from 'react';
import { Calendar } from 'lucide-react';

const TopHeader = () => {
  // Format current date like "May 13, 2025"
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="top-header">
      <div className="top-header-left">
        <h1>Dashboard</h1>
        <p>Welcome back, Admin</p>
      </div>
      
      <div className="top-header-right">
        <div className="date-picker">
          <Calendar size={16} />
          {formattedDate}
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
