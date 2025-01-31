// src/pages/Expenses/Expenses.js
import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

import "./Expenses.css";

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    group_id: "",
  });
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    period: "month",
    value: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [expensesData, groupsData] = await Promise.all([
        api.getExpensesByPeriod(filter.period, filter.value, token),
        api.getMyGroups(token),
      ]);

      console.log("Expenses data:", expensesData); // Add this line
      setExpenses(expensesData);
      setGroups(groupsData);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/v1/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError("Failed to fetch expenses");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.deleteExpense(id, token);
      await fetchExpenses(); // Refresh list after deletion
    } catch (err) {
      setError("Failed to delete expense");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.createExpense(
        {
          ...newExpense,
          amount: parseFloat(newExpense.amount),
          group_id: newExpense.group_id || null,
        },
        token
      );
      setNewExpense({ amount: "", description: "", group_id: "" });
      fetchData();
    } catch (err) {
      setError("Failed to create expense");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="expenses-page">
      <div className="page-header">
        <h1>Expenses</h1>
      </div>

      <div className="expense-form-container">
        {error && <div className="error-message">{error}</div>}
        <h2>Add New Expense</h2>
        <form onSubmit={handleSubmit} className="expense-form">
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense({ ...newExpense, amount: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense({ ...newExpense, description: e.target.value })
            }
            required
            maxLength="200"
          />
          <select
            value={newExpense.group_id}
            onChange={(e) =>
              setNewExpense({ ...newExpense, group_id: e.target.value })
            }
          >
            <option value="">Personal Expense</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <button type="submit">Add Expense</button>
        </form>
      </div>

      <div className="expenses-filter">
        <select
          value={filter.period}
          onChange={(e) => setFilter({ ...filter, period: e.target.value })}
        >
          <option value="day">Daily</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
        <input
          type="date"
          value={filter.value}
          onChange={(e) => setFilter({ ...filter, value: e.target.value })}
        />
      </div>

      <div className="expenses-list">
        {expenses.length === 0 ? (
          <p className="no-expenses">No expenses found for this period.</p>
        ) : (
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Group</th>
                <th>Actions</th> {/* New column */}
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{new Date(expense.created_at).toLocaleDateString()}</td>
                  <td>{expense.description}</td>
                  <td className="amount">${expense.amount.toFixed(2)}</td>
                  <td>{expense.group ? expense.group.name : "Personal"}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this expense?"
                          )
                        ) {
                          handleDelete(expense.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ExpensesPage;
