import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../api";
import { getAdminStats, getAdminKycSubmissions, getAdminUserById, logoutAdmin } from "../services/adminService";

import AdminSimPanel from "../components/AdminSimPanel";
import "../styles/Admin.css";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [kycSubmissions, setKycSubmissions] = useState<any[]>([]);
  const [selectedKycUser, setSelectedKycUser] = useState<any>(null);
  const [showKycModal, setShowKycModal] = useState(false);

  const [adminSimulatorVisible, setAdminSimulatorVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulator'>('dashboard');
  const [loadingKyc, setLoadingKyc] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    async function fetchStats() {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load admin stats. Please sign in again.");
      }
    }

    async function fetchKycSubmissions() {
      try {
        const data = await getAdminKycSubmissions();
        setKycSubmissions(data.submissions || []);
      } catch (err) {
        console.error(err);
      }
    }

    async function loadData() {
      try {
        await Promise.all([fetchStats(), fetchKycSubmissions()]);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    let socket: any;
    (async () => {
      try {
        socket = await getSocket();
        socket.on("kycSubmitted", fetchKycSubmissions);
      } catch (err) {
        console.error("Socket error:", err);
      }
    })();

    return () => {
      if (socket) {
        socket.off("kycSubmitted", fetchKycSubmissions);
      }
    };
  }, [navigate]);

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  const handleViewKyc = async (userId: string) => {
    try {
      setLoadingKyc(true);
      const data = await getAdminUserById(userId);
      setSelectedKycUser(data.user);
      setShowKycModal(true);
    } catch (err) {
      console.error(err);
      setError("Unable to load KYC details.");
    } finally {
      setLoadingKyc(false);
    }
  };

  const closeKycModal = () => {
    setSelectedKycUser(null);
    setShowKycModal(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Control center for platform monitoring</p>
        </div>
        <button className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-nav">
        <button onClick={() => navigate("/admin/users")}>Users</button>
        <button onClick={() => navigate("/admin/deposits")}>Deposits</button>
        <button onClick={() => navigate("/admin/withdrawals")}>Withdrawals</button>
        <button onClick={() => navigate("/admin/balances")}>Balances</button>

        <button
          onClick={() => setActiveTab(activeTab === 'simulator' ? 'dashboard' : 'simulator')}
          style={{ background: activeTab === 'simulator' ? '#1a7fd4' : undefined }}
        >
          Trade Simulator
        </button>
      </div>

      {activeTab === 'simulator' ? (
        <div style={{ padding: '0', marginTop: 0 }}>
          <AdminSimPanel
            visible={true}
            onClose={() => setActiveTab('dashboard')}
            inline={true}
          />
        </div>
      ) : loading ? (
        <p>Loading dashboard...</p>
      ) : error ? (
        <div className="admin-error">{error}</div>
      ) : (
        <>
          <div className="admin-card-grid">
            <div className="admin-card">
              <h3>Users</h3>
              <p>{stats.totalUsers ?? 0}</p>
            </div>
            <div className="admin-card">
              <h3>Pending Deposits</h3>
              <p>{stats.pendingDeposits ?? 0}</p>
            </div>
            <div className="admin-card">
              <h3>Pending Withdrawals</h3>
              <p>{stats.pendingWithdrawals ?? 0}</p>
            </div>
            <div className="admin-card">
              <h3>Pending KYC Submissions</h3>
              <p>{stats.pendingKycCount ?? 0}</p>
            </div>
            <div className="admin-card">
              <h3>Total Platform Balance</h3>
              <p>${stats.totalPlatformBalance?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? 0}</p>
            </div>
          </div>

          <section className="admin-section">
            <div className="admin-section-header">
              <h2>Recent KYC Submissions</h2>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {kycSubmissions.length ? (
                    kycSubmissions.map((submission: any) => (
                      <tr key={submission.id}>
                        <td>{submission.name}</td>
                        <td>{submission.email}</td>
                        <td>{submission.kycVerified ? "Verified" : submission.kycStatus || "Pending"}</td>
                        <td>{submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : "—"}</td>
                        <td>
                          <button className="admin-table-button" onClick={() => handleViewKyc(submission.id)}>
                            View KYC
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>No KYC submissions yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-section">
            <div className="admin-section-header">
              <h2>Recent Transactions</h2>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(stats.recentTransactions) && stats.recentTransactions.length ? (
                    stats.recentTransactions.map((tx: any) => (
                      <tr key={tx._id}>
                        <td>{tx.userId?.email || tx.userId?.name || "Unknown"}</td>
                        <td>{tx.type}</td>
                        <td>${Number(tx.amount).toFixed(2)}</td>
                        <td>{tx.description || "—"}</td>
                        <td>{new Date(tx.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>No recent transactions available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <AdminSimPanel
            visible={adminSimulatorVisible}
            onClose={() => setAdminSimulatorVisible(false)}
          />
          {showKycModal && selectedKycUser && (
            <div className="admin-modal-backdrop" onClick={closeKycModal}>
              <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-header">
                  <h3>KYC Submission</h3>
                  <button className="admin-modal-close" onClick={closeKycModal}>×</button>
                </div>
                {loadingKyc ? (
                  <div>Loading...</div>
                ) : (
                  <div>
                    <p><strong>Name:</strong> {selectedKycUser.name || "—"}</p>
                    <p><strong>Email:</strong> {selectedKycUser.email}</p>
                    <p><strong>KYC Status:</strong> {selectedKycUser.kycVerified ? "Verified" : selectedKycUser.kycStatus || "Pending"}</p>
                    <p><strong>Submitted:</strong> {selectedKycUser.kycSubmission?.submittedAt ? new Date(selectedKycUser.kycSubmission.submittedAt).toLocaleString() : "—"}</p>
                    <div className="admin-modal-section">
                      <h4>Personal Data</h4>
                      <p><strong>Full Name:</strong> {selectedKycUser.kycSubmission?.personal?.fullName || "—"}</p>
                      <p><strong>DOB:</strong> {selectedKycUser.kycSubmission?.personal?.dob || "—"}</p>
                      <p><strong>Country:</strong> {selectedKycUser.kycSubmission?.personal?.country || "—"}</p>
                      <p><strong>Address:</strong> {selectedKycUser.kycSubmission?.personal?.address || "—"}</p>
                      <p><strong>City:</strong> {selectedKycUser.kycSubmission?.personal?.city || "—"}</p>
                    </div>
                    <div className="admin-modal-section">
                      <h4>Documents</h4>
                      <div>
                        <strong>Front:</strong>
                        {selectedKycUser.kycSubmission?.documentFront?.data ? (
                          <img src={selectedKycUser.kycSubmission.documentFront.data} alt="Front document" style={{ maxWidth: "100%", maxHeight: 280, display: "block", margin: "12px 0" }} />
                        ) : (
                          <div>No front document uploaded.</div>
                        )}
                      </div>
                      <div>
                        <strong>Back:</strong>
                        {selectedKycUser.kycSubmission?.documentBack?.data ? (
                          <img src={selectedKycUser.kycSubmission.documentBack.data} alt="Back document" style={{ maxWidth: "100%", maxHeight: 280, display: "block", margin: "12px 0" }} />
                        ) : (
                          <div>No back document uploaded.</div>
                        )}
                      </div>
                      <div>
                        <strong>Selfie:</strong>
                        {selectedKycUser.kycSubmission?.selfie?.data ? (
                          <img src={selectedKycUser.kycSubmission.selfie.data} alt="Selfie" style={{ maxWidth: "100%", maxHeight: 280, display: "block", margin: "12px 0" }} />
                        ) : (
                          <div>No selfie uploaded.</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
