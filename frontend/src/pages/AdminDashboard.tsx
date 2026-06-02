import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../api";
import { getAdminStats, getAdminKycSubmissions, getAdminUserById, logoutAdmin, approveAdminKyc, rejectAdminKyc, updateAdminUser } from "../services/adminService";

import AdminSimPanel from "../components/AdminSimPanel";
import "../styles/Admin.css";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [kycSubmissions, setKycSubmissions] = useState<any[]>([]);
  const [selectedKycUser, setSelectedKycUser] = useState<any>(null);
  const [showKycModal, setShowKycModal] = useState(false);
  const [kycModalTab, setKycModalTab] = useState<'documents' | 'verify'>('documents');

  const [adminSimulatorVisible, setAdminSimulatorVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulator'>('dashboard');
  const [loadingKyc, setLoadingKyc] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingKycAction, setProcessingKycAction] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [rejectionReasons, setRejectionReasons] = useState<string[]>([
    "Document image was blurry or incomplete",
    "Address proof is older than 3 months"
  ]);
  const [selectedReasons, setSelectedReasons] = useState<Set<string>>(new Set());

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
      const user = data.user;
      setSelectedKycUser({
        ...user,
        id: user.id || user._id,
      });
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
    setKycModalTab('documents');
  };

  const handleAcceptKyc = async () => {
    if (!selectedKycUser) return;
    const userId = selectedKycUser.id || selectedKycUser._id;
    try {
      setProcessingKycAction(true);
      await approveAdminKyc(userId);
      setSelectedKycUser({ ...selectedKycUser, kycVerified: true, kycStatus: 'approved', id: userId });
      // Refresh submissions list
      const data = await getAdminKycSubmissions();
      setKycSubmissions(data.submissions || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to approve KYC");
    } finally {
      setProcessingKycAction(false);
    }
  };

  const handleRejectKyc = async () => {
    if (!selectedKycUser) return;
    const userId = selectedKycUser.id || selectedKycUser._id;
    try {
      setProcessingKycAction(true);
      const reasonsList = Array.from(selectedReasons).length > 0 
        ? Array.from(selectedReasons) 
        : rejectionReasons;
      
      await rejectAdminKyc(userId, reasonsList);

      setSelectedKycUser({ 
        ...selectedKycUser, 
        kycVerified: false, 
        kycStatus: 'rejected',
        rejectionReasons: reasonsList,
        id: userId
      });
      
      // Refresh submissions list
      const data = await getAdminKycSubmissions();
      setKycSubmissions(data.submissions || []);
      
      setShowRejectionForm(false);
      setSelectedReasons(new Set());
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to reject KYC");
    } finally {
      setProcessingKycAction(false);
    }
  };

  const toggleRejectionReason = (reason: string) => {
    const newReasons = new Set(selectedReasons);
    if (newReasons.has(reason)) {
      newReasons.delete(reason);
    } else {
      newReasons.add(reason);
    }
    setSelectedReasons(newReasons);
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

                <div className="admin-kyc-tabs">
                  <button 
                    className={`admin-kyc-tab ${kycModalTab === 'documents' ? 'active' : ''}`}
                    onClick={() => setKycModalTab('documents')}
                  >
                    Documents
                  </button>
                  <button 
                    className={`admin-kyc-tab ${kycModalTab === 'verify' ? 'active' : ''}`}
                    onClick={() => setKycModalTab('verify')}
                  >
                    Verify
                  </button>
                </div>

                {loadingKyc ? (
                  <div>Loading...</div>
                ) : kycModalTab === 'documents' ? (
                  <div className="admin-kyc-documents">
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
                ) : (
                  <div className="admin-kyc-verify">
                    <div className="admin-kyc-verify-content">
                      {!showRejectionForm ? (
                        <>
                          <h4>KYC Verification Decision</h4>
                          <p className="admin-kyc-verify-user">
                            <strong>User:</strong> {selectedKycUser.name || "—"} ({selectedKycUser.email})
                          </p>
                          <p className="admin-kyc-verify-status">
                            <strong>Current Status:</strong> 
                            <span className={`status-badge status-${selectedKycUser.kycStatus || 'pending'}`}>
                              {selectedKycUser.kycVerified ? "Verified" : selectedKycUser.kycStatus || "Pending"}
                            </span>
                          </p>
                          <p style={{ marginTop: "24px", color: "#666", fontSize: "14px" }}>
                            Review the documents in the Documents tab before making a decision.
                          </p>
                          <div className="admin-kyc-verify-actions">
                            <button 
                              className="admin-kyc-accept-btn"
                              onClick={handleAcceptKyc}
                              disabled={processingKycAction || selectedKycUser.kycStatus === 'approved'}
                            >
                              {processingKycAction ? "Processing..." : "✓ Accept"}
                            </button>
                            <button 
                              className="admin-kyc-reject-btn"
                              onClick={() => setShowRejectionForm(true)}
                              disabled={processingKycAction || selectedKycUser.kycStatus === 'rejected'}
                            >
                              {processingKycAction ? "Processing..." : "✗ Reject"}
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h4>Select Rejection Reasons</h4>
                          <p className="admin-kyc-verify-user">
                            <strong>User:</strong> {selectedKycUser.name || "—"} ({selectedKycUser.email})
                          </p>
                          <p style={{ marginTop: "12px", marginBottom: "20px", color: "#666", fontSize: "14px" }}>
                            Select the reasons why the KYC submission cannot be approved:
                          </p>
                          
                          <div className="admin-kyc-rejection-reasons">
                            {rejectionReasons.map((reason, idx) => (
                              <label key={idx} className="admin-kyc-reason-checkbox">
                                <input
                                  type="checkbox"
                                  checked={selectedReasons.has(reason)}
                                  onChange={() => toggleRejectionReason(reason)}
                                />
                                <span>{reason}</span>
                              </label>
                            ))}
                          </div>

                          <div className="admin-kyc-rejection-preview">
                            <p style={{ marginBottom: "12px", fontSize: "13px", color: "#7a8a99" }}>
                              <strong>Selected Reasons ({selectedReasons.size}):</strong>
                            </p>
                            {selectedReasons.size === 0 ? (
                              <p style={{ color: "#c0392b", fontSize: "13px" }}>⚠️ Please select at least one reason</p>
                            ) : (
                              <ul style={{ margin: "0", padding: "0 0 0 20px", fontSize: "13px" }}>
                                {Array.from(selectedReasons).map((reason, idx) => (
                                  <li key={idx} style={{ color: "#e74c3c" }}>{reason}</li>
                                ))}
                              </ul>
                            )}
                          </div>

                          <div className="admin-kyc-rejection-actions">
                            <button 
                              className="admin-kyc-cancel-btn"
                              onClick={() => {
                                setShowRejectionForm(false);
                                setSelectedReasons(new Set());
                              }}
                              disabled={processingKycAction}
                            >
                              Cancel
                            </button>
                            <button 
                              className="admin-kyc-confirm-reject-btn"
                              onClick={handleRejectKyc}
                              disabled={processingKycAction || selectedReasons.size === 0}
                            >
                              {processingKycAction ? "Processing..." : "Confirm Rejection"}
                            </button>
                          </div>
                        </>
                      )}
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
