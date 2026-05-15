import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  approveAdminWithdrawal,
  getAdminWithdrawals,
  logoutAdmin,
  rejectAdminWithdrawal,
} from "../services/adminService";
import "../styles/Admin.css";

const AdminWithdrawals: React.FC = () => {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWithdrawals = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAdminWithdrawals(status);
      setWithdrawals(data.withdrawals || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load withdrawal requests.");
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

    fetchWithdrawals();
  }, [navigate, status]);

  const handleApprove = async (withdrawalId: string) => {
    const notes = window.prompt("Approval notes (optional):", "");
    if (notes === null) return;

    try {
      await approveAdminWithdrawal(withdrawalId, notes || "Approved by admin");
      fetchWithdrawals();
    } catch (err) {
      console.error(err);
      setError("Unable to approve withdrawal.");
    }
  };

  const handleReject = async (withdrawalId: string) => {
    const reason = window.prompt("Rejection reason:", "Insufficient funds");
    if (reason === null) return;

    try {
      await rejectAdminWithdrawal(withdrawalId, reason || "Rejected by admin");
      fetchWithdrawals();
    } catch (err) {
      console.error(err);
      setError("Unable to reject withdrawal.");
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
          <h1>Withdrawals</h1>
          <p>Review and manage withdrawal requests.</p>
        </div>
        <button className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-nav">
        <button onClick={() => navigate("/admin")}>Dashboard</button>
        <button onClick={() => navigate("/admin/users")}>Users</button>
        <button onClick={() => navigate("/admin/deposits")}>Deposits</button>
        <button onClick={() => navigate("/admin/balances")}>Balances</button>
      </div>

      <div className="admin-filters">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button onClick={fetchWithdrawals}>Refresh</button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Wallet</th>
              <th>Status</th>
              <th>Requested At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>Loading withdrawals...</td>
              </tr>
            ) : withdrawals.length ? (
              withdrawals.map((withdrawal) => (
                <tr key={withdrawal._id || withdrawal.id}>
                  <td>{withdrawal.userId?.email || withdrawal.userId?.name || "Unknown"}</td>
                  <td>${Number(withdrawal.amount || 0).toFixed(2)}</td>
                  <td>{withdrawal.walletAddress || withdrawal.wallet || "-"}</td>
                  <td>{withdrawal.status}</td>
                  <td>{new Date(withdrawal.createdAt).toLocaleString()}</td>
                  <td>
                    {withdrawal.status === "pending" ? (
                      <>
                        <button className="admin-action-btn" onClick={() => handleApprove(withdrawal._id || withdrawal.id)}>
                          Approve
                        </button>
                        <button className="admin-action-btn" onClick={() => handleReject(withdrawal._id || withdrawal.id)}>
                          Reject
                        </button>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No withdrawals found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminWithdrawals;
