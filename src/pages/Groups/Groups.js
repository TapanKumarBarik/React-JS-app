import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./Groups.css";

function GroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
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
    if (searchQuery.length >= 2) {
      const searchUsers = async () => {
        try {
          const token = localStorage.getItem("token");
          const users = await api.searchUsers(searchQuery, token);
          setSearchResults(users);
        } catch (err) {
          console.error("Failed to search users:", err);
        }
      };

      const timeoutId = setTimeout(searchUsers, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

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

      // Reset form and close modal
      setNewGroup({ name: "", member_ids: [] });
      setSelectedMembers([]);
      setShowModal(false);

      // Show success message
      alert("Group created successfully!");

      // Refresh groups list
      fetchGroups();
    } catch (err) {
      alert("Failed to create group. Please try again.");
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

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="groups-page">
      <div className="groups-header">
        <h1>My Groups</h1>
        <button className="add-group-btn" onClick={() => setShowModal(true)}>
          <span>+</span> Create New Group
        </button>
      </div>

      <div className="groups-grid">
        {groups.map((group) => (
          <div
            key={group.id}
            className="group-card"
            onClick={() => handleGroupClick(group.id)}
          >
            <h3>{group.name}</h3>
            <div className="group-info">
              <p>Members: {group.member_count}</p>
              <p>Created: {new Date(group.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h2>Create New Group</h2>
            <form onSubmit={handleCreateGroup}>
              <div className="form-group">
                <label>Group Name</label>
                <input
                  type="text"
                  placeholder="Enter a name for your group"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Add Members</label>
                <div className="member-search">
                  <input
                    type="text"
                    placeholder="Type username to search..."
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
                          <span className="username">{user.username}</span>
                          <span className="add-icon">+</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {selectedMembers.length > 0 && (
                <div className="form-group">
                  <label>Selected Members</label>
                  <div className="selected-members">
                    {selectedMembers.map((member) => (
                      <div key={member.id} className="selected-member">
                        <span>{member.username}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.id)}
                          className="remove-member"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" className="create-button">
                Create Group
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupsPage;
