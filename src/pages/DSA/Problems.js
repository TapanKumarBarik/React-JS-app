import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import "./Problems.css";

function Problems() {
  const [problems, setProblems] = useState([]);
  const [tags, setTags] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: "",
    status: "",
    tag_id: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [newProblem, setNewProblem] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    status: "not_started",
    source_url: "",
    confidence_score: 0,
    priority: 0,
    notes: "",
    solution: "",
    time_complexity: "",
    space_complexity: "",
    tag_ids: [],
  });

  useEffect(() => {
    fetchProblems();
    fetchTags();
  }, [filters]);
  const fetchProblems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Create new object with only non-empty filters
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "")
      );

      const data = await api.dsaApi.getAllProblems(activeFilters, token);
      setProblems(data);
    } catch (error) {
      console.error("Error fetching problems:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await api.dsaApi.getAllTags(token);
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleCreateProblem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingProblem) {
        await api.dsaApi.updateProblem(editingProblem.id, newProblem, token);
      } else {
        await api.dsaApi.createProblem(newProblem, token);
      }
      setShowModal(false);
      setEditingProblem(null);
      resetForm();
      fetchProblems();
    } catch (error) {
      console.error("Error saving problem:", error);
    }
  };

  const handleDeleteProblem = async (problemId) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        const token = localStorage.getItem("token");
        await api.dsaApi.deleteProblem(problemId, token);
        fetchProblems();
      } catch (error) {
        console.error("Error deleting problem:", error);
      }
    }
  };

  const handleEditProblem = (problem) => {
    setEditingProblem(problem);
    setNewProblem({
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      status: problem.status,
      source_url: problem.source_url || "",
      confidence_score: problem.confidence_score,
      priority: problem.priority,
      notes: problem.notes || "",
      solution: problem.solution || "",
      time_complexity: problem.time_complexity || "",
      space_complexity: problem.space_complexity || "",
      tag_ids: problem.tags.map((tag) => tag.id),
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setNewProblem({
      title: "",
      description: "",
      difficulty: "easy",
      status: "not_started",
      source_url: "",
      confidence_score: 0,
      priority: 0,
      notes: "",
      solution: "",
      time_complexity: "",
      space_complexity: "",
      tag_ids: [],
    });
  };

  const filteredProblems = problems.filter(
    (problem) =>
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="problems-container">
      <div className="problems-header">
        <h1>DSA Problems</h1>
        <div className="problem-actions">
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={() => setShowModal(true)} className="add-button">
            Add Problem
          </button>
        </div>
      </div>
      <div className="filters-section">
        <select
          value={filters.difficulty}
          onChange={(e) =>
            setFilters({ ...filters, difficulty: e.target.value })
          }
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="need_review">Need Review</option>
        </select>

        <select
          value={filters.tag_id}
          onChange={(e) => setFilters({ ...filters, tag_id: e.target.value })}
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="loading">Loading problems...</div>
      ) : (
        <div className="problems-grid">
          {filteredProblems.map((problem) => (
            <div
              key={problem.id}
              className={`problem-card difficulty-${problem.difficulty}`}
            >
              <div className="problem-header">
                <h3>{problem.title}</h3>
                <div className="problem-actions">
                  <button
                    onClick={() => handleEditProblem(problem)}
                    className="edit-button"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDeleteProblem(problem.id)}
                    className="delete-button"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div className="problem-tags">
                {problem.tags.map((tag) => (
                  <span key={tag.id} className="tag">
                    {tag.name}
                  </span>
                ))}
              </div>

              <div className="problem-meta">
                <span className={`status status-${problem.status}`}>
                  {problem.status.replace("_", " ")}
                </span>
                <span className="confidence">
                  Confidence: {problem.confidence_score}/5
                </span>
                <span className="priority">Priority: {problem.priority}/5</span>
              </div>

              <p className="description">{problem.description}</p>

              {problem.source_url && (
                <a
                  href={problem.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-link"
                >
                  View Problem Source
                </a>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Problem Modal Form */}
      // In src/pages/DSA/Problems.js
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingProblem ? "Edit Problem" : "Add New Problem"}</h2>
            <form onSubmit={handleCreateProblem}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newProblem.title}
                  onChange={(e) =>
                    setNewProblem({ ...newProblem, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newProblem.description}
                  onChange={(e) =>
                    setNewProblem({
                      ...newProblem,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select
                  value={newProblem.difficulty}
                  onChange={(e) =>
                    setNewProblem({ ...newProblem, difficulty: e.target.value })
                  }
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label>Source URL</label>
                <input
                  type="url"
                  value={newProblem.source_url}
                  onChange={(e) =>
                    setNewProblem({ ...newProblem, source_url: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Tags</label>
                <select
                  multiple
                  value={newProblem.tag_ids}
                  onChange={(e) =>
                    setNewProblem({
                      ...newProblem,
                      tag_ids: Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      ),
                    })
                  }
                >
                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="submit-button">
                {editingProblem ? "Update Problem" : "Add Problem"}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Problems;
