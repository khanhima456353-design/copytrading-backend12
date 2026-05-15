import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  banAdminUser,
  getAdminUsers,
  logoutAdmin,
} from "../services/adminService";
import "../styles/Admin.css";

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAdminUsers(search, status, 1, 100);
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchUsers();
  }, [navigate]);

  const handleToggleBan = async (userId: string, isBanned: boolean) => {
    try {
      await banAdminUser(userId, !isBanned);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError("Unable to update user status.");
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
          <h1>Users</h1>
          <p>Search, filter and manage user accounts.</p>
        </div>
        <button className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-filters">
        <input
          type="text"
          value={search}
          placeholder="Search by name or email"
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
          <option value="kyc_verified">KYC Verified</option>
          <option value="kyc_pending">KYC Pending</option>
          <option value="kyc_rejected">KYC Rejected</option>
        </select>
        <button onClick={fetchUsers}>Refresh</button>
        <button onClick={() => navigate("/admin")}>Dashboard</button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Balance</th>
              <th>Frozen</th>
              <th>Role</th>
              <th>KYC</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9}>Loading users...</td>
              </tr>
            ) : users.length ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name || "-"}</td>
                  <td>{user.email}</td>
                  <td>${Number(user.balance || 0).toFixed(2)}</td>
                  <td>${Number(user.frozenBalance || 0).toFixed(2)}</td>
                  <td>{user.role || "user"}</td>
                  <td>{user.kycVerified ? "Verified" : user.kycStatus || "Pending"}</td>
                  <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "-"}</td>
                  <td>{user.isBanned ? "Banned" : "Active"}</td>
                  <td>
                    <button
                      className="admin-action-btn"
                      onClick={() => navigate(`/admin/user/${user._id}`)}
                    >
                      Profile
                    </button>
                    <button
                      className="admin-action-btn"
                      onClick={() => handleToggleBan(user._id, user.isBanned)}
                    >
                      {user.isBanned ? "Unban" : "Ban"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
