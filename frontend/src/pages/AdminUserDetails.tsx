import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAdminUserById,
  getAdminUserDeposits,
  getAdminUserTransactions,
  getAdminUserWithdrawals,
  logoutAdmin,
  updateAdminUser,
} from "../services/adminService";
import "../styles/Admin.css";

const AdminUserDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const loadData = async () => {
      try {
        if (!id) throw new Error("User ID is required");
        const [userData, depositData, withdrawalData, transactionData] = await Promise.all([
          getAdminUserById(id),
          getAdminUserDeposits(id),
          getAdminUserWithdrawals(id),
          getAdminUserTransactions(id),
        ]);

        setUser(userData.user);
        setDeposits(depositData.deposits || []);
        setWithdrawals(withdrawalData.withdrawals || []);
        setTransactions(transactionData.transactions || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load user details.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  const handleAction = async (updates: Record<string, any>) => {
    if (!id) return;
    try {
      await updateAdminUser(id, updates);
      const refreshed = await getAdminUserById(id);
      setUser(refreshed.user);
    } catch (err) {
      console.error(err);
      setError("Unable to update user.");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>User Details</h1>
          <p>Review this user's profile and account activity.</p>
        </div>
        <button className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-nav">
        <button onClick={() => navigate("/admin")}>Dashboard</button>
        <button onClick={() => navigate("/admin/users")}>Back to users</button>
      </div>

      {loading ? (
        <p>Loading user details...</p>
      ) : error ? (
        <div className="admin-error">{error}</div>
      ) : !user ? (
        <div className="admin-error">User not found.</div>
      ) : (
        <>
          <div className="admin-card-grid">
            <div className="admin-card admin-card-large">
              <h3>Profile</h3>
              <p><strong>Name:</strong> {user.name || "-"}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Status:</strong> {user.isBanned ? "Banned" : "Active"}</p>
              <p><strong>KYC:</strong> {user.kycVerified ? "Verified" : user.kycStatus || "Pending"}</p>
              {user.kycSubmission?.submittedAt && (
                <div style={{ marginTop: 12 }}>
                  <p><strong>KYC submitted:</strong> {new Date(user.kycSubmission.submittedAt).toLocaleString()}</p>
                  <p><strong>Document:</strong> {user.kycSubmission.documentType || "—"}</p>
                </div>
              )}
              <p><strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "-"}</p>
            </div>
            <div className="admin-card admin-card-large">
              <h3>Balances</h3>
              <p><strong>Available:</strong> ${Number(user.balance || 0).toFixed(2)}</p>
              <p><strong>Frozen:</strong> ${Number(user.frozenBalance || 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="admin-actions">
            <button onClick={() => handleAction({ isBanned: !user.isBanned })}>
              {user.isBanned ? "Unban User" : "Ban User"}
            </button>
            <button onClick={() => handleAction({ kycVerified: true, kycStatus: "approved" })}>
              Verify KYC
            </button>
            <button onClick={() => handleAction({ kycVerified: false, kycStatus: "rejected" })}>
              Reject KYC
            </button>
          </div>

          {user.kycSubmission?.submittedAt && (
            <section className="admin-section">
              <h2>KYC Submission Details</h2>
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <p><strong>Document type:</strong> {user.kycSubmission.documentType || "—"}</p>
                  <p><strong>Submitted At:</strong> {new Date(user.kycSubmission.submittedAt).toLocaleString()}</p>
                  <p><strong>Full Name:</strong> {user.kycSubmission.personal.fullName || "—"}</p>
                  <p><strong>DOB:</strong> {user.kycSubmission.personal.dob || "—"}</p>
                  <p><strong>Country:</strong> {user.kycSubmission.personal.country || "—"}</p>
                  <p><strong>Address:</strong> {user.kycSubmission.personal.address || "—"}</p>
                  <p><strong>City:</strong> {user.kycSubmission.personal.city || "—"}</p>
                </div>
                <div style={{ display: "grid", gap: 12 }}>
                  <div>
                    <strong>Document Front</strong>
                    {user.kycSubmission.documentFront?.data ? (
                      <img src={user.kycSubmission.documentFront.data} alt="Document front" style={{ width: "100%", maxHeight: 260, objectFit: "contain", borderRadius: 12, marginTop: 8 }} />
                    ) : (
                      <p>No front image uploaded.</p>
                    )}
                  </div>
                  <div>
                    <strong>Document Back</strong>
                    {user.kycSubmission.documentBack?.data ? (
                      <img src={user.kycSubmission.documentBack.data} alt="Document back" style={{ width: "100%", maxHeight: 260, objectFit: "contain", borderRadius: 12, marginTop: 8 }} />
                    ) : (
                      <p>No back image uploaded.</p>
                    )}
                  </div>
                  <div>
                    <strong>Selfie</strong>
                    {user.kycSubmission.selfie?.data ? (
                      <img src={user.kycSubmission.selfie.data} alt="Selfie" style={{ width: "100%", maxHeight: 260, objectFit: "contain", borderRadius: 12, marginTop: 8 }} />
                    ) : (
                      <p>No selfie uploaded.</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="admin-section">
            <h2>Recent Deposits</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Reference</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.length ? (
                    deposits.map((deposit) => (
                      <tr key={deposit._id}>
                        <td>${Number(deposit.amount).toFixed(2)}</td>
                        <td>{deposit.paymentMethod || "-"}</td>
                        <td>{deposit.status}</td>
                        <td>{deposit.transactionRef || "-"}</td>
                        <td>{new Date(deposit.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>No deposit history.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-section">
            <h2>Recent Withdrawals</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Wallet</th>
                    <th>Status</th>
                    <th>Network</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.length ? (
                    withdrawals.map((withdrawal) => (
                      <tr key={withdrawal._id}>
                        <td>${Number(withdrawal.amount).toFixed(2)}</td>
                        <td>{withdrawal.walletAddress || "-"}</td>
                        <td>{withdrawal.status}</td>
                        <td>{withdrawal.network || "-"}</td>
                        <td>{new Date(withdrawal.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>No withdrawals found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-section">
            <h2>Recent Transactions</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length ? (
                    transactions.map((tx) => (
                      <tr key={tx._id}>
                        <td>{tx.type}</td>
                        <td>${Number(tx.amount).toFixed(2)}</td>
                        <td>{tx.description || "-"}</td>
                        <td>{new Date(tx.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>No recent transaction history.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminUserDetails;
