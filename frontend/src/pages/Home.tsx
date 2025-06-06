import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { CreateTeamModal, EditTeamModal, DeleteTeamModal, TeamDetailsModal } from "../components/TeamModals";

interface Team {
  id: number;
  name: string;
  creator_id: number;
  creator_email?: string;
}

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Placeholder data for tasks
  const tasks = [
    { id: 1, title: "Design Login Page", team: "Frontend Team", assignee: "Alice", due: "2025-06-10" },
    { id: 2, title: "API Auth Route", team: "Backend Team", assignee: "Bob", due: "2025-06-12" },
  ];

  // Fetch teams from backend
  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/teams', {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setTeams(data);
      }
    } catch (err) {
      console.error('Failed to fetch teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = () => {
    setShowCreateModal(true);
  };

  const handleViewTeamDetails = (team: Team) => {
    setSelectedTeam(team);
    setShowDetailsModal(true);
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setShowDetailsModal(false); // Close details modal
    setShowEditModal(true);
  };

  const handleDeleteTeam = (team: Team) => {
    setSelectedTeam(team);
    setShowDetailsModal(false); // Close details modal
    setShowDeleteModal(true);
  };

  const handleTeamCreated = () => {
    fetchTeams();
  };

  const handleTeamUpdated = () => {
    fetchTeams();
  };

  const handleTeamDeleted = () => {
    fetchTeams();
  };

  // Simplified Admin Actions (removed Create Task and Add Members)
  const AdminActions = () => (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <button 
        onClick={handleCreateTeam}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
      >
        + Create Team
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
                <button 
                  onClick={handleCreateTeam}
                  className="text-purple-600 hover:text-purple-800 text-sm"
                >
                  + Add Team
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="text-center py-4">Loading teams...</div>
            ) : (
              <ul>
                {teams.length > 0 ? (
                  teams.map((team) => (
                    <li key={team.id} className="py-2 border-b last:border-b-0 flex justify-between items-center">
                      <div 
                        className="flex flex-col cursor-pointer flex-1"
                        onClick={() => handleViewTeamDetails(team)}
                      >
                        <span className="font-medium hover:text-purple-600 transition">{team.name}</span>
                        {team.creator_email && (
                          <span className="text-xs text-gray-500">Created by: {team.creator_email}</span>
                        )}
                      </div>
                      
                    </li>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No teams found. {user?.is_admin && "Create your first team!"}
                  </div>
                )}
              </ul>
            )}
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
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
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

        {/* Modals */}
        <CreateTeamModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onTeamCreated={handleTeamCreated}
        />
        
        <TeamDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          team={selectedTeam}
          onEdit={handleEditTeam}
          onDelete={handleDeleteTeam}
        />
        
        <EditTeamModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          team={selectedTeam}
          onTeamUpdated={handleTeamUpdated}
        />
        
        <DeleteTeamModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          team={selectedTeam}
          onTeamDeleted={handleTeamDeleted}
        />
      </div>
    </div>
  );
};

export default Home;