import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { CreateTeamModal, EditTeamModal, DeleteTeamModal, TeamDetailsModal } from "../components/TeamModals";
import { EditTaskModal, DeleteTaskModal } from "../components/TaskModals";

interface Team {
  id: number;
  name: string;
  creator_id: number;
  creator_email?: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  team_id: number;
  assigned_to?: number;
  team_name?: string;
  assignee_email?: string;
}

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  
  // Modal states for teams
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Modal states for tasks
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filter states
  const [taskSearch, setTaskSearch] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('');

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

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setTasksLoading(true);
      const url = selectedTeamFilter 
        ? `/api/tasks?team_id=${selectedTeamFilter}`
        : '/api/tasks';
      
      const res = await fetch(url, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchTasks();
  }, []);

  // Refetch tasks when team filter changes
  useEffect(() => {
    fetchTasks();
  }, [selectedTeamFilter]);

  const handleCreateTeam = () => {
    setShowCreateModal(true);
  };

  const handleViewTeamDetails = (team: Team) => {
    setSelectedTeam(team);
    setShowDetailsModal(true);
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setShowDetailsModal(false);
    setShowEditModal(true);
  };

  const handleDeleteTeam = (team: Team) => {
    setSelectedTeam(team);
    setShowDetailsModal(false);
    setShowDeleteModal(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowEditTaskModal(true);
  };

  const handleDeleteTask = (task: Task) => {
    setSelectedTask(task);
    setShowDeleteTaskModal(true);
  };

  const handleTeamCreated = () => {
    fetchTeams();
  };

  const handleTeamUpdated = () => {
    fetchTeams();
  };

  const handleTeamDeleted = () => {
    fetchTeams();
    fetchTasks(); // Refresh tasks as they might be affected
  };

  const handleTaskUpdated = () => {
    fetchTasks();
  };

  const handleTaskDeleted = () => {
    fetchTasks();
  };

  // Enhanced filter tasks based on search
  const filteredTasks = tasks.filter(task => {
    if (!taskSearch.trim()) return true;
    
    const searchTerm = taskSearch.toLowerCase().trim();
    
    return (
      task.title.toLowerCase().includes(searchTerm) ||
      (task.description && task.description.toLowerCase().includes(searchTerm)) ||
      (task.team_name && task.team_name.toLowerCase().includes(searchTerm)) ||
      (task.assignee_email && task.assignee_email.toLowerCase().includes(searchTerm))
    );
  });

  // Add search results count
  const getSearchResultsText = () => {
    if (!taskSearch.trim()) return '';
    const count = filteredTasks.length;
    return count === 1 ? '1 task found' : `${count} tasks found`;
  };

  // Clear search function
  const clearSearch = () => {
    setTaskSearch('');
  };

  // Helper function to highlight search terms
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim() || !text) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <span>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark key={index} className="bg-yellow-200 px-1 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  // Simplified Admin Actions
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
      <div className="max-w-4xl mx-auto">
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

        {/* Column Layout: Teams above Tasks */}
        <div className="flex flex-col space-y-8">
          
          {/* Team List - FIRST (Top) */}
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
              <div 
                className="overflow-y-auto border border-gray-100 rounded"
                style={{ 
                  height: teams.length > 0 
                    ? `${Math.min(200 + (teams.length * 60), 400)}px` 
                    : '200px' 
                }}
              >
                <ul className="p-2">
                  {teams.length > 0 ? (
                    teams.map((team) => (
                      <li key={team.id} className="py-3 border-b last:border-b-0 flex justify-between items-center hover:bg-gray-50 px-2 rounded">
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
                    <div className="text-center py-8 text-gray-500">
                      No teams found. {user?.is_admin && "Create your first team!"}
                    </div>
                  )}
                </ul>
              </div>
            )}
          </section>

          {/* Task List - SECOND (Bottom) */}
          <section className="bg-white rounded-xl shadow p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <h2 className="text-xl font-bold text-blue-700">
                {user?.is_admin ? "All Tasks" : "My Tasks"}
              </h2>
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Enhanced Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={taskSearch}
                    onChange={(e) => setTaskSearch(e.target.value)}
                    className="border px-3 py-1 pr-8 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 w-full sm:w-48"
                  />
                  {taskSearch && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {user?.is_admin && (
                  <select 
                    value={selectedTeamFilter}
                    onChange={(e) => setSelectedTeamFilter(e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                  >
                    <option value="">All Teams</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            
            {/* Search Results Info */}
            {taskSearch.trim() && (
              <div className="mb-3 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded">
                🔍 {getSearchResultsText()} for "{taskSearch}"
                <button
                  onClick={clearSearch}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Clear search
                </button>
              </div>
            )}
            
            {tasksLoading ? (
              <div className="text-center py-4">Loading tasks...</div>
            ) : (
              <div 
                className="overflow-y-auto border border-gray-100 rounded"
                style={{ 
                  height: filteredTasks.length > 0 
                    ? `${Math.min(250 + (filteredTasks.length * 100), 600)}px` 
                    : '250px' 
                }}
              >
                <div className="p-2">
                  {filteredTasks.length > 0 ? (
                    <ul className="space-y-3">
                      {filteredTasks.map((task) => (
                        <li key={task.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col flex-1">
                              {/* Highlighted Task Title */}
                              <span className="font-medium text-gray-800 mb-1">
                                {highlightSearchTerm(task.title, taskSearch)}
                              </span>
                              {task.description && (
                                <span className="text-sm text-gray-600 mb-2">
                                  {highlightSearchTerm(task.description, taskSearch)}
                                </span>
                              )}
                              <div className="text-xs text-gray-500 space-y-1">
                                <div>
                                  <span className="font-medium">Team:</span> {highlightSearchTerm(task.team_name || 'Unknown Team', taskSearch)}
                                </div>
                                <div>
                                  <span className="font-medium">Assignee:</span> {highlightSearchTerm(task.assignee_email || 'Unassigned', taskSearch)}
                                </div>
                                <div>
                                  <span className="font-medium">Due:</span> {formatDate(task.due_date)}
                                </div>
                              </div>
                            </div>
                            {user?.is_admin && (
                              <div className="flex flex-col gap-1 ml-4">
                                <button 
                                  onClick={() => handleEditTask(task)}
                                  className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-200 rounded hover:bg-blue-50"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteTask(task)}
                                  className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border border-red-200 rounded hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {taskSearch.trim() ? (
                        <div>
                          <div className="mb-2">No tasks match your search: "{taskSearch}"</div>
                          <button
                            onClick={clearSearch}
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            Clear search to see all tasks
                          </button>
                        </div>
                      ) : (
                        'No tasks found. Create tasks from team details!'
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Team Modals */}
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

        {/* Task Modals */}
        <EditTaskModal
          isOpen={showEditTaskModal}
          onClose={() => setShowEditTaskModal(false)}
          task={selectedTask}
          onTaskUpdated={handleTaskUpdated}
        />
        
        <DeleteTaskModal
          isOpen={showDeleteTaskModal}
          onClose={() => setShowDeleteTaskModal(false)}
          task={selectedTask}
          onTaskDeleted={handleTaskDeleted}
        />
      </div>
    </div>
  );
};

export default Home;