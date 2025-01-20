import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api";
import "./GroupDetails.css";

function GroupDetails() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    userId: "",
  });

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  const fetchGroupData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [groupData, membersList, expensesList] = await Promise.all([
        api.getGroupDetails(groupId, token),
        api.getGroupMembers(groupId, token),
        api.getGroupExpenses(groupId, token),
      ]);

      setGroup(groupData);
      setMembers(membersList);
      setExpenses(expensesList);
    } catch (err) {
      console.error("Failed to fetch group data:", err);
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.created_at);
    return (
      (!filters.dateFrom || expenseDate >= new Date(filters.dateFrom)) &&
      (!filters.dateTo || expenseDate <= new Date(filters.dateTo)) &&
      (!filters.userId || expense.user_id === filters.userId)
    );
  });

  return (
    <div className="group-details">
      {group && (
        <>
          <div className="group-header">
            <h1>{group.name}</h1>
            <div className="group-meta">
              <p>Created by: {group.created_by}</p>
              <p>
                Created on: {new Date(group.created_at).toLocaleDateString()}
              </p>
              <p>Members: {group.member_count}</p>
            </div>
          </div>

          <div className="members-section">
            <h2>Members</h2>
            <div className="members-list">
              {members.map((member, index) => (
                <div key={index} className="member-item">
                  {member}
                </div>
              ))}
            </div>
          </div>

          <div className="expenses-section">
            <h2>Expenses</h2>
            <div className="filters">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
                placeholder="From Date"
              />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
                placeholder="To Date"
              />
              <select
                value={filters.userId}
                onChange={(e) =>
                  setFilters({ ...filters, userId: e.target.value })
                }
              >
                <option value="">All Members</option>
                {members.map((member, index) => (
                  <option key={index} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </div>

            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Paid By</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{new Date(expense.created_at).toLocaleDateString()}</td>
                    <td>{expense.description}</td>
                    <td>${expense.amount.toFixed(2)}</td>
                    <td>{expense.user_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default GroupDetails;
