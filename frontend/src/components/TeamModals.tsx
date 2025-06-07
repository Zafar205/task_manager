import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { CreateTaskModal } from './TaskModals';

interface Team {
  id: number;
  name: string;
  creator_id: number;
  creator_email?: string;
}

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamCreated: () => void;
}

interface EditTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  onTeamUpdated: () => void;
}

interface DeleteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  onTeamDeleted: () => void;
}

interface TeamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ 
  isOpen, 
  onClose, 
  onTeamCreated 
}) => {
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName }),
        credentials: 'include'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create team');
      }

      setTeamName('');
      onTeamCreated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Team">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Name
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter team name"
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-red-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Team'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({
  isOpen,
  onClose,
  team,
  onEdit,
  onDelete
}) => {
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [teamTasks, setTeamTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch team-specific data when modal opens
  useEffect(() => {
    if (isOpen && team) {
      fetchTeamData();
    }
  }, [isOpen, team]);

  const fetchTeamData = async () => {
    if (!team) return;
    
    setLoading(true);
    try {
      // Fetch team tasks
      const tasksRes = await fetch(`/api/tasks?team_id=${team.id}`, {
        credentials: 'include'
      });
      if (tasksRes.ok) {
        const tasks = await tasksRes.json();
        setTeamTasks(tasks);
      }

      // Fetch team members (you'll need to implement this endpoint)
      const membersRes = await fetch(`/api/teams/${team.id}/members`, {
        credentials: 'include'
      });
      if (membersRes.ok) {
        const members = await membersRes.json();
        setTeamMembers(members);
      }
    } catch (err) {
      console.error('Failed to fetch team data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setShowCreateTaskModal(true);
  };

  const handleAddMembers = () => {
    setShowAddMembersModal(true);
  };

  const handleTaskCreated = () => {
    fetchTeamData(); // Refresh team data
    setShowCreateTaskModal(false);
  };

  const handleMembersAdded = () => {
    fetchTeamData(); // Refresh team data
    setShowAddMembersModal(false);
  };

  const handleCloseDetails = () => {
    setShowCreateTaskModal(false);
    setShowAddMembersModal(false);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCloseDetails} title={`Team: ${team?.name || 'Details'}`}>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* Team Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Team Information</h3>
            <p className="text-sm text-gray-600">
              <strong>Name:</strong> {team?.name}
            </p>
            {team?.creator_email && (
              <p className="text-sm text-gray-600">
                <strong>Created by:</strong> {team.creator_email}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Quick Actions</h3>
            
            <button
              onClick={handleCreateTask}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <span>📝</span>
              Create Task for this Team
            </button>
            
            <button
              onClick={handleAddMembers}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <span>👥</span>
              Add Team Members
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={() => team && onEdit(team)}
                className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition"
              >
                Edit Team
              </button>
              
              <button
                onClick={() => team && onDelete(team)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Delete Team
              </button>
            </div>
          </div>

          {/* Team Statistics */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Team Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{teamMembers.length}</div>
                <div className="text-blue-700">Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{teamTasks.length}</div>
                <div className="text-blue-700">Tasks</div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-green-800">Team Members</h3>
              <button 
                onClick={handleAddMembers}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                + Add
              </button>
            </div>
            {loading ? (
              <p className="text-sm text-gray-500">Loading members...</p>
            ) : teamMembers.length > 0 ? (
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {teamMembers.map((member: any) => (
                  <div key={member.id} className="text-sm text-green-700 flex justify-between items-center">
                    <span>{member.email}</span>
                    <span className="text-xs text-green-600">{member.role || 'Member'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No members assigned yet</p>
            )}
          </div>

          {/* Recent Tasks */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-purple-800">Recent Tasks</h3>
              <button 
                onClick={handleCreateTask}
                className="text-purple-600 hover:text-purple-800 text-sm"
              >
                + Create
              </button>
            </div>
            {loading ? (
              <p className="text-sm text-gray-500">Loading tasks...</p>
            ) : teamTasks.length > 0 ? (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {teamTasks.slice(0, 3).map((task: any) => (
                  <div key={task.id} className="text-sm bg-white p-2 rounded border">
                    <div className="font-medium text-purple-800">{task.title}</div>
                    <div className="text-xs text-gray-600">
                      {task.assignee_email ? `Assigned to: ${task.assignee_email}` : 'Unassigned'}
                      {task.due_date && ` • Due: ${new Date(task.due_date).toLocaleDateString()}`}
                    </div>
                  </div>
                ))}
                {teamTasks.length > 3 && (
                  <p className="text-xs text-purple-600">...and {teamTasks.length - 3} more tasks</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No tasks created yet</p>
            )}
          </div>

          {/* Close Button */}
          <div className="pt-4 border-t">
            <button
              onClick={handleCloseDetails}
              className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        teamId={team?.id || 0}
        teamName={team?.name || ''}
        onTaskCreated={handleTaskCreated}
      />

      {/* Add Members Modal */}
      <AddMembersModal
        isOpen={showAddMembersModal}
        onClose={() => setShowAddMembersModal(false)}
        teamId={team?.id || 0}
        teamName={team?.name || ''}
        onMembersAdded={handleMembersAdded}
      />
    </>
  );
};

interface AddMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: number;
  teamName: string;
  onMembersAdded: () => void;
}

export const AddMembersModal: React.FC<AddMembersModalProps> = ({
  isOpen,
  onClose,
  teamId,
  teamName,
  onMembersAdded
}) => {
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchAvailableUsers();
    }
  }, [isOpen]);

  const fetchAvailableUsers = async () => {
    try {
      const res = await fetch('/api/users', {
        credentials: 'include'
      });
      if (res.ok) {
        const users = await res.json();
        setAvailableUsers(users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleUserToggle = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

// In the AddMembersModal handleSubmit function, add better error logging:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (selectedUsers.length === 0) {
    setError('Please select at least one user');
    return;
  }

  setLoading(true);
  setError('');

  try {
    console.log('Sending request:', { userIds: selectedUsers }); // Debug log

    const res = await fetch(`/api/teams/${teamId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds: selectedUsers }),
      credentials: 'include'
    });

    console.log('Response status:', res.status); // Debug log

    if (!res.ok) {
      const data = await res.json();
      console.error('Error response:', data); // Debug log
      throw new Error(data.message || 'Failed to add members');
    }

    setSelectedUsers([]);
    onMembersAdded();
    onClose();
  } catch (err: any) {
    console.error('Add members error:', err); // Debug log
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Members to ${teamName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Users to Add
          </label>
          <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
            {availableUsers.length > 0 ? (
              availableUsers.map(user => (
                <label key={user.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserToggle(user.id)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm">{user.email}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500 p-2">No users available</p>
            )}
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || selectedUsers.length === 0}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : `Add ${selectedUsers.length} Member(s)`}
          </button>
        </div>
      </form>
    </Modal>
  );
};
export const EditTeamModal: React.FC<EditTeamModalProps> = ({ 
  isOpen, 
  onClose, 
  team, 
  onTeamUpdated 
}) => {
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (team) {
      setTeamName(team.name);
    }
  }, [team]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/teams/${team.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName }),
        credentials: 'include'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update team');
      }

      onTeamUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Team">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Name
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter team name"
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Team'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const DeleteTeamModal: React.FC<DeleteTeamModalProps> = ({ 
  isOpen, 
  onClose, 
  team, 
  onTeamDeleted 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!team) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/teams/${team.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete team');
      }

      onTeamDeleted();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Team">
      <div className="mb-4">
        <p className="text-gray-700">
          Are you sure you want to delete <strong>{team?.name}</strong>?
        </p>
        <p className="text-sm text-gray-500 mt-2">
          This action cannot be undone. All tasks associated with this team will also be affected.
        </p>
      </div>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Delete Team'}
        </button>
      </div>
    </Modal>
  );
};