import React from 'react';

interface DashboardProps {
  modalContext?: any;
  pageTitle?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ pageTitle }) => {
  return (
    <div className="p-6">
      <h2 className="">{pageTitle}</h2>
    </div>
  );
};

export default Dashboard;