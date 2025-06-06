import React from "react";
import { useAuth } from "../context/AuthContext";

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Placeholder data for teams and tasks
  const teams = [
    { id: 1, name: "Frontend Team" },
    { id: 2, name: "Backend Team" },
  ];
  const tasks = [
    { id: 1, title: "Design Login Page", team: "Frontend Team", assignee: "Alice", due: "2025-06-10" },
    { id: 2, title: "API Auth Route", team: "Backend Team", assignee: "Bob", due: "2025-06-12" },
  ];

  // Admin-only actions
  const AdminActions = () => (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
        + Create Team
      </button>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
        + Create Task
      </button>
      <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition">
        + Add Team Members
      </button>
    </div>
  );

  // Regular user actions
  const UserActions = () => (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
        View My Tasks
      </button>
      <button className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition">
        Update Task Status
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-700 mb-2">Team Task Manager</h1>
            <p className="text-gray-600">
              Welcome, {user?.email}! 
              {user?.is_admin && <span className="ml-2 bg-yellow-400 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">ADMIN</span>}
            </p>
          </div>
          <button 
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </header>

        {/* Role-based Actions */}
        {user?.is_admin ? <AdminActions /> : <UserActions />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Team List - Different view for admin vs user */}
          <section className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-purple-700">
                {user?.is_admin ? "All Teams" : "My Teams"}
              </h2>
              {user?.is_admin && (
                <button className="text-purple-600 hover:text-purple-800 text-sm">
                  Manage Teams
                </button>
              )}
            </div>
            <ul>
              {teams.map((team) => (
                <li key={team.id} className="py-2 border-b last:border-b-0 flex justify-between items-center">
                  <span className="font-medium">{team.name}</span>
                  {user?.is_admin && (
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Task List - Different view for admin vs user */}
          <section className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-700">
                {user?.is_admin ? "All Tasks" : "My Tasks"}
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="border px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                {user?.is_admin && (
                  <select className="border px-2 py-1 rounded text-sm">
                    <option>All Teams</option>
                    <option>Frontend Team</option>
                    <option>Backend Team</option>
                  </select>
                )}
              </div>
            </div>
            <ul>
              {tasks.map((task) => (
                <li key={task.id} className="py-2 border-b last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="font-medium">{task.title}</span>
                      <span className="text-sm text-gray-500">
                        Team: {task.team} | Assignee: {task.assignee} | Due: {task.due}
                      </span>
                    </div>
                    {user?.is_admin && (
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                        <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Admin-only Statistics Section */}
        {user?.is_admin && (
          <section className="mt-8 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Admin Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-purple-700">2</h3>
                <p className="text-purple-600">Total Teams</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-blue-700">5</h3>
                <p className="text-blue-600">Total Users</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-green-700">8</h3>
                <p className="text-green-600">Active Tasks</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-yellow-700">3</h3>
                <p className="text-yellow-600">Overdue Tasks</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;