import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./Groups.css";

function GroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({ name: "", member_ids: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const fetchedGroups = await api.getMyGroups(token);
      setGroups(fetchedGroups);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch groups");
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.createGroup(newGroup, token);
      setNewGroup({ name: "", member_ids: [] });
      fetchGroups();
    } catch (err) {
      setError("Failed to create group");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="groups-page">
      <div className="page-header">
        <h1>Groups</h1>
      </div>

      <div className="create-group">
        <h2>Create New Group</h2>
        <form onSubmit={handleCreateGroup}>
          <input
            type="text"
            placeholder="Enter group name..."
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            required
          />
          <button type="submit">Create Group</button>
        </form>
      </div>

      <div className="groups-list">
        {groups.map((group) => (
          <div
            key={group.id}
            className="group-card"
            onClick={() => handleGroupClick(group.id)}
            role="button"
            tabIndex={0}
          >
            <div className="click-indicator">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5l-8 8h16l-8-8z" />
              </svg>
              Click to view
            </div>
            <h3>{group.name}</h3>
            <div className="group-card-stats">
              <div className="stat-item">
                <span className="stat-label">Members</span>
                <span className="stat-value">{group.member_count}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Created</span>
                <span className="stat-value">
                  {new Date(group.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GroupsPage;
