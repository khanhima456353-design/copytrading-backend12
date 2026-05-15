import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addAdminBalance,
  creditAdminBonus,
  freezeAdminFunds,
  getAdminUserById,
  getAdminUserTransactions,
  getAdminUsers,
  logoutAdmin,
  removeAdminBalance,
  updateAdminUser,
} from "../services/adminService";
import "../styles/Admin.css";

const AdminBalances: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setError(null);
    try {
      const data = await getAdminUsers(search, "", 1, 50);
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load users.");
    }
  };

  const fetchUserTransactions = async (userId: string) => {
    try {
      const data = await getAdminUserTransactions(userId);
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load transaction history.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
  }, [navigate]);

  const selectUser = async (userId: string) => {
    setError(null);
    try {
      const data = await getAdminUserById(userId);
      setSelectedUser(data.user || null);
      fetchUserTransactions(userId);
    } catch (err) {
      console.error(err);
      setError("Unable to select user.");
    }
  };

  const handleAction = async (action: "add" | "remove" | "credit" | "freeze") => {
    if (!selectedUser) return;
    setError(null);

    try {
      if (action === "add") {
        await addAdminBalance(selectedUser._id || selectedUser.id, balanceAmount, description);
      } else if (action === "remove") {
        await removeAdminBalance(selectedUser._id || selectedUser.id, balanceAmount, description);
      } else if (action === "credit") {
        await creditAdminBonus(selectedUser._id || selectedUser.id, balanceAmount, description);
      } else if (action === "freeze") {
        await freezeAdminFunds(selectedUser._id || selectedUser.id, balanceAmount, description);
      }
      const updated = await getAdminUserById(selectedUser._id || selectedUser.id);
      setSelectedUser(updated.user || selectedUser);
      fetchUserTransactions(selectedUser._id || selectedUser.id);
      setBalanceAmount(0);
      setDescription("");
    } catch (err) {
      console.error(err);
      setError("Unable to perform balance action.");
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Balance Management</h1>
          <p>Adjust user balances, provide bonuses, or freeze funds.</p>
        </div>
        <button className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-nav">
        <button onClick={() => navigate("/admin")}>Dashboard</button>
        <button onClick={() => navigate("/admin/users")}>Users</button>
        <button onClick={() => navigate("/admin/deposits")}>Deposits</button>
        <button onClick={() => navigate("/admin/withdrawals")}>Withdrawals</button>
      </div>

      <div className="admin-search-section">
        <div className="admin-search-row">
          <input
            type="text"
            value={search}
            placeholder="Search users by email or name"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={fetchUsers}>Search Users</button>
        </div>

        {users.length > 0 && (
          <div className="admin-user-list">
            <h3>Select a user</h3>
            <ul>
              {users.map((user) => (
                <li key={user._id || user.id}>
                  <button className="admin-link-button" onClick={() => selectUser(user._id || user.id)}>
                    {user.email} — {user.name || "No name"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {selectedUser ? (
        <div className="admin-card">
          <h2>Selected User</h2>
          <p>
            <strong>Email:</strong> {selectedUser.email}
          </p>
          <p>
            <strong>Name:</strong> {selectedUser.name || "N/A"}
          </p>
          <p>
            <strong>Balance:</strong> ${Number(selectedUser.balance || selectedUser.walletBalance || 0).toFixed(2)}
          </p>
          <p>
            <strong>Frozen:</strong> ${Number(selectedUser.frozenBalance || 0).toFixed(2)}
          </p>

          <div className="admin-form-row">
            <input
              type="number"
              value={balanceAmount}
              placeholder="Amount"
              onChange={(e) => setBalanceAmount(Number(e.target.value))}
            />
            <input
              type="text"
              value={description}
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="admin-actions-row">
            <button className="admin-action-btn" onClick={() => handleAction("add")}>
              Add Balance
            </button>
            <button className="admin-action-btn" onClick={() => handleAction("remove")}>
              Remove Balance
            </button>
            <button className="admin-action-btn" onClick={() => handleAction("credit")}>
              Credit Bonus
            </button>
            <button className="admin-action-btn" onClick={() => handleAction("freeze")}>
              Freeze Funds
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <p>Search for a user above to manage balances.</p>
        </div>
      )}

      {error && <div className="admin-error">{error}</div>}

      {selectedUser && (
        <div className="admin-card">
          <h2>Recent Balance Activity</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Action</th>
                  <th>Amount</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length ? (
                  transactions.map((tx) => (
                    <tr key={tx._id || tx.id || `${tx.date}-${tx.amount}`}> 
                      <td>{new Date(tx.createdAt || tx.date || tx.timestamp).toLocaleString()}</td>
                      <td>{tx.type || tx.action || "Balance"}</td>
                      <td>${Number(tx.amount || 0).toFixed(2)}</td>
                      <td>{tx.description || tx.notes || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>No balance history available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBalances;
