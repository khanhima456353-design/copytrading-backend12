import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  approveAdminDeposit,
  getAdminDeposits,
  logoutAdmin,
  rejectAdminDeposit,
} from "../services/adminService";
import "../styles/Admin.css";

const AdminDeposits: React.FC = () => {
  const navigate = useNavigate();
  const [deposits, setDeposits] = useState<any[]>([]);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeposits = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAdminDeposits(status);
      setDeposits(data.deposits || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load deposit requests.");
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

    fetchDeposits();
  }, [navigate, status]);

  const handleApprove = async (depositId: string) => {
    const transactionRef = window.prompt("Transaction reference (optional):", "");
    if (transactionRef === null) return;

    try {
      await approveAdminDeposit(depositId, transactionRef || "");
      fetchDeposits();
    } catch (err) {
      console.error(err);
      setError("Unable to approve deposit.");
    }
  };

  const handleReject = async (depositId: string) => {
    const reason = window.prompt("Rejection reason:", "Insufficient information");
    if (reason === null) return;

    try {
      await rejectAdminDeposit(depositId, reason || "Rejected by admin");
      fetchDeposits();
    } catch (err) {
      console.error(err);
      setError("Unable to reject deposit.");
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
          <h1>Deposits</h1>
          <p>Approve or reject pending deposit requests.</p>
        </div>
        <button className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-nav">
        <button onClick={() => navigate("/admin")}>Dashboard</button>
        <button onClick={() => navigate("/admin/users")}>Users</button>
        <button onClick={() => navigate("/admin/withdrawals")}>Withdrawals</button>
        <button onClick={() => navigate("/admin/balances")}>Balances</button>
      </div>

      <div className="admin-filters">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button onClick={fetchDeposits}>Refresh</button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Coin</th>
              <th>Wallet</th>
              <th>Status</th>
              <th>Reference</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>Loading deposits...</td>
              </tr>
            ) : deposits.length ? (
              deposits.map((deposit) => (
                <tr key={deposit._id || deposit.id}>
                  <td>{deposit.userId?.email || deposit.userId?.name || "Unknown"}</td>
                  <td>${Number(deposit.amount || 0).toFixed(2)}</td>
                  <td>{deposit.coin || deposit.paymentMethod || "N/A"}</td>
                  <td>{deposit.walletAddress || deposit.notes || "-"}</td>
                  <td>{deposit.status}</td>
                  <td>{deposit.transactionRef || "-"}</td>
                  <td>{new Date(deposit.createdAt).toLocaleString()}</td>
                  <td>
                    {deposit.status === "pending" ? (
                      <>
                        <button className="admin-action-btn" onClick={() => handleApprove(deposit._id || deposit.id)}>
                          Approve
                        </button>
                        <button className="admin-action-btn" onClick={() => handleReject(deposit._id || deposit.id)}>
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
                <td colSpan={8}>No deposits found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDeposits;
