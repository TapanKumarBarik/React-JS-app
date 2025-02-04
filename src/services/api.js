// src/services/api.js
const BASE_URL = "http://localhost:8000/api/v1";

export const api = {
  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
    return response.json();
  },

  login: async (credentials) => {
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response = await fetch(`${BASE_URL}/token`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
    return response.json();
  },

  getCurrentUser: async (token) => {
    const response = await fetch(`${BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
    return response.json();
  },
  // Groups API methods
  createGroup: async (groupData, token) => {
    const response = await fetch(`${BASE_URL}/groups/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(groupData),
    });
    if (!response.ok) throw await response.json();
    return response.json();
  },

  getGroupDetails: async (groupId, token) => {
    const response = await fetch(`${BASE_URL}/groups/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw await response.json();
    return response.json();
  },

  getMyGroups: async (token) => {
    const response = await fetch(`${BASE_URL}/groups/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw await response.json();
    return response.json();
  },

  addGroupMember: async (groupId, userId, token) => {
    const response = await fetch(
      `${BASE_URL}/groups/${groupId}/members/${userId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) throw await response.json();
    return response.json();
  },

  getGroupExpenses: async (groupId, token) => {
    const response = await fetch(`${BASE_URL}/groups/${groupId}/expenses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw await response.json();
    return response.json();
  },

  getGroupMembers: async (groupId, token) => {
    const response = await fetch(`${BASE_URL}/groups/${groupId}/members`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw await response.json();
    return response.json();
  },

  // Expenses API methods
  createExpense: async (expenseData, token) => {
    const response = await fetch(`${BASE_URL}/expenses/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(expenseData),
    });
    if (!response.ok) throw await response.json();
    return response.json();
  },

  getUserExpenses: async (token) => {
    const response = await fetch(`${BASE_URL}/expenses/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw await response.json();
    return response.json();
  },

  getExpensesByPeriod: async (period, value, token) => {
    const response = await fetch(
      `${BASE_URL}/expenses/?period=${period}&value=${value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) throw await response.json();
    return response.json();
  },

  // Update the existing createGroup method with member_ids support
  createGroup: async (groupData, token) => {
    const response = await fetch(`${BASE_URL}/groups/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: groupData.name,
        member_ids: groupData.member_ids || [], // Add support for member_ids
      }),
    });
    if (!response.ok) throw await response.json();
    return response.json();
  },

  // Add this to the api object in api.js
  deleteExpense: async (expenseId, token) => {
    const response = await fetch(`${BASE_URL}/expenses/${expenseId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw await response.json();
    return response.json();
  },

  // In src/services/api.js, add/update this method:
  searchUsers: async (query, token) => {
    const endpoint = query
      ? `${BASE_URL}/users/search?query=${query}`
      : `${BASE_URL}/users/search`;

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw await response.json();
    return response.json();
  },

  // Add this to the api object
  deleteGroup: async (groupId, token) => {
    const response = await fetch(`${BASE_URL}/groups/${groupId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw await response.json();
    return response.json(); // Will return { message: "Group deleted successfully", group_id: groupId }
  },

  // Add these methods to the api object in api.js
  todos: {
    create: async (todoData, token) => {
      const response = await fetch(`${BASE_URL}/todos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(todoData),
      });
      if (!response.ok) throw await response.json();
      return response.json();
    },

    getActive: async (token) => {
      const response = await fetch(`${BASE_URL}/todos/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw await response.json();
      return response.json();
    },
    update: async (todoId, todoData, token) => {
      const response = await fetch(`${BASE_URL}/todos/${todoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: todoData.title,
          description: todoData.description,
          due_date: todoData.due_date,
          status: todoData.status,
        }),
      });
      if (!response.ok) throw await response.json();
      return response.json();
    },

    delete: async (todoId, token) => {
      const response = await fetch(`${BASE_URL}/todos/${todoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw await response.json();
      return response.json();
    },

    getCompleted: async (token) => {
      const response = await fetch(`${BASE_URL}/todos/completed`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw await response.json();
      return response.json();
    },
  },
  // Add this to the existing api object in src/services/api.js
  notebooks: {
    create: async (notebookData, token) => {
      const response = await fetch(`${BASE_URL}/notebooks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(notebookData),
      });
      if (!response.ok) throw await response.json();
      return response.json();
    },

    getAll: async (token) => {
      const response = await fetch(`${BASE_URL}/notebooks/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw await response.json();
      return response.json();
    },

    delete: async (notebookId, token) => {
      const response = await fetch(`${BASE_URL}/notebooks/${notebookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw await response.json();
      return response.json();
    },
  },

  sections: {
    create: async (notebookId, sectionData, token) => {
      const response = await fetch(
        `${BASE_URL}/notebooks/${notebookId}/sections/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(sectionData),
        }
      );
      if (!response.ok) throw await response.json();
      return response.json();
    },

    getAll: async (notebookId, token) => {
      const response = await fetch(
        `${BASE_URL}/notebooks/${notebookId}/sections/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw await response.json();
      return response.json();
    },

    delete: async (sectionId, token) => {
      const response = await fetch(`${BASE_URL}/sections/${sectionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw await response.json();
      return response.json();
    },
  },

  pages: {
    create: async (sectionId, pageData, token) => {
      const response = await fetch(`${BASE_URL}/sections/${sectionId}/pages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pageData),
      });
      if (!response.ok) throw await response.json();
      return response.json();
    },

    getAll: async (sectionId, token) => {
      const response = await fetch(`${BASE_URL}/sections/${sectionId}/pages/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw await response.json();
      return response.json();
    },

    update: async (pageId, pageData, token) => {
      const response = await fetch(`${BASE_URL}/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pageData),
      });
      if (!response.ok) throw await response.json();
      return response.json();
    },

    delete: async (pageId, token) => {
      const response = await fetch(`${BASE_URL}/pages/${pageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw await response.json();
      return response.json();
    },
  },
};
