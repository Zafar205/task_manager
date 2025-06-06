import React, { useState, useEffect } from 'react';
import Modal from './Modal';

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
  const handleCreateTask = () => {
    // TODO: Implement create task functionality
    alert(`Create task for team: ${team?.name}`);
  };

  const handleAddMembers = () => {
    // TODO: Implement add members functionality
    alert(`Add members to team: ${team?.name}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Team: ${team?.name || 'Details'}`}>
      <div className="space-y-4">
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
          <h3 className="font-semibold text-gray-800">Actions</h3>
          
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

        {/* Team Stats (placeholder) */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Team Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-blue-700">Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-blue-700">Active Tasks</div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Close
        </button>
      </div>
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