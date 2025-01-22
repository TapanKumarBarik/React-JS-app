import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./Groups.css";
import Swal from "sweetalert2";

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
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem("userProfile"));

      // If no members selected, use current user as default member
      const memberIds =
        selectedMembers.length > 0
          ? selectedMembers.map((member) => member.id)
          : [currentUser.id];

      await api.createGroup(
        {
          ...newGroup,
          member_ids: memberIds,
        },
        token
      );

      // Reset form and close modal
      setNewGroup({ name: "", member_ids: [] });
      setSelectedMembers([]);
      setShowModal(false);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Group created successfully",
        showConfirmButton: false,
        timer: 1500,
        position: "top-end",
        toast: true,
      });
      // Refresh groups list
      fetchGroups();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to create group. Please try again.",
        confirmButtonColor: "#3085d6",
      });
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

  const handleDeleteGroup = async (e, groupId) => {
    e.stopPropagation(); // Prevent click from bubbling to card
    // Show delete confirmation with SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const response = await api.deleteGroup(groupId, token);

        if (response.message === "Group deleted successfully") {
          setGroups(groups.filter((group) => group.id !== groupId));

          // Show success message
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Group has been deleted.",
            showConfirmButton: false,
            timer: 1500,
            position: "top-end",
            toast: true,
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete group. Please try again.",
          confirmButtonColor: "#3085d6",
        });
        console.error("Delete group error:", err);
      }
    }
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
            <button
              className="delete-group-btn"
              onClick={(e) => handleDeleteGroup(e, group.id)}
              title="Delete Group"
            >
              ×
            </button>
            <div className="group-card-inner">
              <h3>{group.name}</h3>
              <div className="group-info">
                <p>Members: {group.member_count}</p>
                <p>
                  Created: {new Date(group.created_at).toLocaleDateString()}
                </p>
              </div>
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
