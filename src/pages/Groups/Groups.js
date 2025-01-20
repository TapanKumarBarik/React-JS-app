import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./Groups.css";

function GroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({
    name: "",
    member_ids: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length >= 2) {
        try {
          const token = localStorage.getItem("token");
          const users = await api.searchUsers(searchQuery, token);
          setSearchResults(users);
        } catch (err) {
          console.error("Failed to search users:", err);
        }
      } else {
        setSearchResults([]);
      }
    };
    const timeoutId = setTimeout(searchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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
      await api.createGroup(
        {
          ...newGroup,
          member_ids: selectedMembers.map((member) => member.id),
        },
        token
      );
      setNewGroup({ name: "", member_ids: [] });
      setSelectedMembers([]);
      fetchGroups();
    } catch (err) {
      setError("Failed to create group");
    }
  };

  const handleAddMember = (user) => {
    if (!selectedMembers.find((member) => member.id === user.id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRemoveMember = (userId) => {
    setSelectedMembers(
      selectedMembers.filter((member) => member.id !== userId)
    );
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

          <div className="member-search">
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="search-result-item"
                    onClick={() => handleAddMember(user)}
                  >
                    {user.username}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="selected-members">
            {selectedMembers.map((member) => (
              <div key={member.id} className="selected-member">
                {member.username}
                <button
                  type="button"
                  onClick={() => handleRemoveMember(member.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

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
