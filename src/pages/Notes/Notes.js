import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import "./Notes.css";
import Swal from "sweetalert2";

function Notes() {
  // State for main data
  const [notebooks, setNotebooks] = useState([]);
  const [sections, setSections] = useState([]);
  const [pages, setPages] = useState([]);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [pageContent, setPageContent] = useState("");

  // UI state
  const [isPageView, setIsPageView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showNotebookModal, setShowNotebookModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showPageModal, setShowPageModal] = useState(false);
  const [newNotebookTitle, setNewNotebookTitle] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newPageTitle, setNewPageTitle] = useState("");

  // Initial load of notebooks
  useEffect(() => {
    fetchNotebooks();
  }, []);

  // Fetch sections when notebook is selected
  useEffect(() => {
    if (selectedNotebook) {
      fetchSections(selectedNotebook.id);
      setSections([]);
      setPages([]);
      setCurrentPage(null);
    }
  }, [selectedNotebook]);

  // Fetch pages when section is selected
  useEffect(() => {
    if (selectedSection) {
      fetchPages(selectedSection.id);
      setPages([]);
      setCurrentPage(null);
    }
  }, [selectedSection]);

  // API calls
  const fetchNotebooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await api.notebooks.getAll(token);
      setNotebooks(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch notebooks");
      setLoading(false);
    }
  };

  const fetchSections = async (notebookId) => {
    try {
      const token = localStorage.getItem("token");
      const data = await api.sections.getAll(notebookId, token);
      setSections(data);
    } catch (err) {
      setError("Failed to fetch sections");
    }
  };

  const fetchPages = async (sectionId) => {
    try {
      const token = localStorage.getItem("token");
      const data = await api.pages.getAll(sectionId, token);
      setPages(data);
    } catch (err) {
      setError("Failed to fetch pages");
    }
  };

  // Event handlers
  const handleCreateNotebook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.notebooks.create({ title: newNotebookTitle }, token);
      setNewNotebookTitle("");
      setShowNotebookModal(false);
      fetchNotebooks();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Notebook created successfully",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create notebook",
      });
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (!selectedNotebook) return;

    try {
      const token = localStorage.getItem("token");
      await api.sections.create(
        selectedNotebook.id,
        { title: newSectionTitle },
        token
      );
      setNewSectionTitle("");
      setShowSectionModal(false);
      fetchSections(selectedNotebook.id);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Section created successfully",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create section",
      });
    }
  };

  const handleCreatePage = async (e) => {
    e.preventDefault();
    if (!selectedSection) return;

    try {
      const token = localStorage.getItem("token");
      const newPage = await api.pages.create(
        selectedSection.id,
        {
          title: newPageTitle,
          content: "",
        },
        token
      );

      setNewPageTitle("");
      setShowPageModal(false);
      fetchPages(selectedSection.id);
      setCurrentPage(newPage);
      setPageContent("");
      setIsPageView(true);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Page created successfully",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create page",
      });
    }
  };

  const handlePageClick = async (page) => {
    setCurrentPage(page);
    setPageContent(page.content || "");
    setIsPageView(true);
  };
  // Add these functions before the return statement

  const handleDeleteNotebook = async (notebookId) => {
    try {
      const token = localStorage.getItem("token");
      await api.notebooks.delete(notebookId, token);

      // Reset states
      if (selectedNotebook?.id === notebookId) {
        setSelectedNotebook(null);
        setSelectedSection(null);
        setCurrentPage(null);
        setSections([]);
        setPages([]);
      }

      // Refresh notebooks list
      fetchNotebooks();

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Notebook deleted successfully",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete notebook",
      });
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      const token = localStorage.getItem("token");
      await api.sections.delete(sectionId, token);

      // Reset states
      if (selectedSection?.id === sectionId) {
        setSelectedSection(null);
        setCurrentPage(null);
        setPages([]);
      }

      // Refresh sections list
      if (selectedNotebook) {
        fetchSections(selectedNotebook.id);
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Section deleted successfully",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete section",
      });
    }
  };
  const handleSavePage = async () => {
    if (!currentPage) return;

    try {
      const token = localStorage.getItem("token");
      await api.pages.update(
        currentPage.id,
        {
          title: currentPage.title,
          content: pageContent,
        },
        token
      );

      Swal.fire({
        icon: "success",
        title: "Saved!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save page",
      });
    }
  };

  const handleBackToPages = () => {
    setIsPageView(false);
    setCurrentPage(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Render UI
  return (
    <div className="notes-container">
      {/* Notebooks Sidebar */}
      <div className="notebooks-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Notebooks</h2>
          <button
            className="add-button"
            onClick={() => setShowNotebookModal(true)}
          >
            +
          </button>
        </div>
        <div className="notebook-list">
          {notebooks.map((notebook) => (
            <div
              key={notebook.id}
              className={`notebook-item ${
                selectedNotebook?.id === notebook.id ? "active" : ""
              }`}
              onClick={() => setSelectedNotebook(notebook)}
            >
              {notebook.title}
              <button
                className="delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNotebook(notebook.id);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sections Sidebar */}
      <div className="sections-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Sections</h2>
          {selectedNotebook && (
            <button
              className="add-button"
              onClick={() => setShowSectionModal(true)}
            >
              +
            </button>
          )}
        </div>
        <div className="section-list">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`section-item ${
                selectedSection?.id === section.id ? "active" : ""
              }`}
              onClick={() => setSelectedSection(section)}
            >
              {section.title}
              <button
                className="delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSection(section.id);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="content-area">
        {selectedSection && (
          <div className="page-editor">
            <div className="page-header">
              <button
                className="add-button"
                onClick={() => setShowPageModal(true)}
              >
                New Page
              </button>
            </div>

            {/* Pages List View */}
            {!isPageView && (
              <div className="pages-list">
                {pages.length > 0 ? (
                  pages.map((page) => (
                    <div
                      key={page.id}
                      className="page-item"
                      onClick={() => handlePageClick(page)}
                    >
                      <h3>{page.title}</h3>
                      <p className="page-preview">
                        {page.content?.substring(0, 100) || "No content"}...
                      </p>
                      <span className="page-date">
                        {new Date(page.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <h3>No pages yet</h3>
                    <p>Create a new page to get started</p>
                  </div>
                )}
              </div>
            )}

            {/* Single Page View */}
            {isPageView && currentPage && (
              <div className="single-page-view">
                <button
                  className="back-button"
                  onClick={() => setIsPageView(false)}
                >
                  ← Back to Pages
                </button>
                <input
                  type="text"
                  className="page-title"
                  value={currentPage.title}
                  onChange={(e) =>
                    setCurrentPage({ ...currentPage, title: e.target.value })
                  }
                />
                <textarea
                  className="page-content"
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                />
                <button className="submit-button" onClick={handleSavePage}>
                  Save
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showNotebookModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowNotebookModal(false)}
            >
              ×
            </button>
            <h2 className="modal-title">Create New Notebook</h2>
            <form onSubmit={handleCreateNotebook}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newNotebookTitle}
                  onChange={(e) => setNewNotebookTitle(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Create Notebook
              </button>
            </form>
          </div>
        </div>
      )}

      {showSectionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowSectionModal(false)}
            >
              ×
            </button>
            <h2 className="modal-title">Create New Section</h2>
            <form onSubmit={handleCreateSection}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Create Section
              </button>
            </form>
          </div>
        </div>
      )}

      {showPageModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowPageModal(false)}
            >
              ×
            </button>
            <h2 className="modal-title">Create New Page</h2>
            <form onSubmit={handleCreatePage}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Create Page
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;
