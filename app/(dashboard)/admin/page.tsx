import React from "react";

const AdminHome = () => {
  return (
    <div>
      <div className="flex-1 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Stats</h1>
            <p className="mt-2">
              Here you can see basic statistics of all of your sites
            </p>
          </div>
        </div>
      </div>
      <div className="border-b mb-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6 md:p-8">
        <div className="border-2">
          <div className="stats">
            <div className="stat">
              <div className="stat-title text-secondary">Registerd Users</div>
              <div className="stat-value">0</div>
              <div className="stat-desc">No change since last month</div>
            </div>
          </div>
        </div>
        <div className="border-2">
          <div className="stats">
            <div className="stat">
              <div className="stat-title text-secondary">Enrollments</div>
              <div className="stat-value">0</div>
              <div className="stat-desc">No change since last month</div>
            </div>
          </div>
        </div>
        <div className="border-2">
          <div className="stats">
            <div className="stat">
              <div className="stat-title text-secondary">
                Generated Certificates
              </div>
              <div className="stat-value">0</div>
              <div className="stat-desc">No change since last month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
