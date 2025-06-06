import React from "react";

const Home: React.FC = () => {
  // Placeholder data for teams and tasks
  const teams = [
    { id: 1, name: "Frontend Team" },
    { id: 2, name: "Backend Team" },
  ];
  const tasks = [
    { id: 1, title: "Design Login Page", team: "Frontend Team", assignee: "Alice", due: "2025-06-10" },
    { id: 2, title: "API Auth Route", team: "Backend Team", assignee: "Bob", due: "2025-06-12" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-purple-700 mb-2">Team Task Manager</h1>
          <p className="text-gray-600">Manage your teams and tasks efficiently.</p>
        </header>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
            + Create Team
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            + Create Task
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Team List */}
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-purple-700 mb-4">Your Teams</h2>
            <ul>
              {teams.map((team) => (
                <li key={team.id} className="py-2 border-b last:border-b-0">
                  <span className="font-medium">{team.name}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Task List */}
          <section className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-700">Tasks</h2>
              <input
                type="text"
                placeholder="Search tasks..."
                className="border px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <ul>
              {tasks.map((task) => (
                <li key={task.id} className="py-2 border-b last:border-b-0">
                  <div className="flex flex-col">
                    <span className="font-medium">{task.title}</span>
                    <span className="text-sm text-gray-500">
                      Team: {task.team} | Assignee: {task.assignee} | Due: {task.due}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;