import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/theme/ThemeContext";

function getKycColors(theme: string) {
  if (theme === "light") {
    return {
      bg: "#f0f2f5",
      textPrimary: "#1e293b",
      textSecondary: "#475569",
      textMuted: "#64748b",
      textHint: "#94a3b8",
      cardBg: "#ffffff",
      cardBorder: "rgba(0,0,0,0.08)",
      cardBorderLight: "rgba(0,0,0,0.12)",
      cardBorderLighter: "rgba(0,0,0,0.16)",
      cardBorderStep: "rgba(0,0,0,0.1)",
      dropzoneBg: "#f1f5f9",
      inputBg: "#ffffff",
      inputColor: "#0f172a",
      inputBorder: "rgba(0,0,0,0.16)",
      previewBg: "#e2e8f0",
      uploadTitleColor: "#0f172a",
      removeBtnBg: "#ffffff",
      removeBtnBorder: "rgba(0,0,0,0.12)",
      removeBtnColor: "#0f172a",
      secondaryBtnBg: "rgba(0,0,0,0.04)",
      secondaryBtnColor: "#1e293b",
      secondaryBtnBorder: "rgba(0,0,0,0.16)",
      summaryItemBg: "#ffffff",
      successCardBg: "#ffffff",
      successTextColor: "#1e293b",
      stepperLabelColor: "#1e293b",
      benefitCardBg: "#ffffff",
      benefitCardColor: "#1e293b",
      benefitCardShadow: "0 20px 60px rgba(15,23,42,0.08)",
      limitCardBg: "#ffffff",
      limitCardBorder: "rgba(0,0,0,0.08)",
      limitValueColor: "#1e293b",
      stepBgInactive: "rgba(0,0,0,0.03)",
      stepBgActive: "rgba(240,185,11,0.1)",
      stepBorderComplete: "rgba(16,185,129,0.2)",
      userProfileColor: "#475569",
      userEmailColor: "#64748b",
      gradientBg: "radial-gradient(circle at top, rgba(240,185,11,0.08), transparent 28%), #f0f2f5",
    };
  }
  return {
    bg: "#01050f",
    textPrimary: "#e2e8f0",
    textSecondary: "#cbd5e1",
    textMuted: "#94a3b8",
    textHint: "#64748b",
    cardBg: "rgba(255,255,255,0.06)",
    cardBorder: "rgba(148,163,184,0.16)",
    cardBorderLight: "rgba(148,163,184,0.24)",
    cardBorderLighter: "rgba(148,163,184,0.32)",
    cardBorderStep: "rgba(148,163,184,0.18)",
    dropzoneBg: "#f8fafc",
    inputBg: "rgba(255,255,255,0.92)",
    inputColor: "#111827",
    inputBorder: "rgba(148,163,184,0.24)",
    previewBg: "#e2e8f0",
    uploadTitleColor: "#0f172a",
    removeBtnBg: "#fff",
    removeBtnBorder: "rgba(15,23,42,0.12)",
    removeBtnColor: "#0f172a",
    secondaryBtnBg: "rgba(255,255,255,0.08)",
    secondaryBtnColor: "#e2e8f0",
    secondaryBtnBorder: "rgba(148,163,184,0.24)",
    summaryItemBg: "rgba(255,255,255,0.94)",
    successCardBg: "rgba(255,255,255,0.96)",
    successTextColor: "#111827",
    stepperLabelColor: "#f8fafc",
    benefitCardBg: "rgba(255,255,255,0.95)",
    benefitCardColor: "#111827",
    benefitCardShadow: "0 20px 60px rgba(15,23,42,0.12)",
    limitCardBg: "rgba(255,255,255,0.08)",
    limitCardBorder: "rgba(148,163,184,0.16)",
    limitValueColor: "#f8fafc",
    stepBgInactive: "rgba(255,255,255,0.04)",
    stepBgActive: "rgba(240,185,11,0.12)",
    stepBorderComplete: "rgba(16,185,129,0.16)",
    userProfileColor: "#cbd5e1",
    userEmailColor: "#94a3b8",
    gradientBg: "radial-gradient(circle at top, rgba(240,185,11,0.1), transparent 28%), #01050f",
  };
}

const LOCAL_STORAGE_KEY = "swancore_kyc_state";

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Singapore",
  "India",
  "Brazil",
  "Mexico",
];

type VerificationStatus = "not-started" | "pending" | "verified" | "rejected";
type DocumentType = "passport" | "national_id" | "driver_license";

type FilePreview = {
  name: string;
  type: string;
  size: number;
  preview: string;
};

type KycState = {
  status: VerificationStatus;
  currentStep: number;
  personal: {
    fullName: string;
    dob: string;
    country: string;
    address: string;
    city: string;
  };
  documentType: DocumentType;
  documentFront: FilePreview | null;
  documentBack: FilePreview | null;
  selfie: FilePreview | null;
  rejectionReason: string;
  submittedAt: string | null;
  approvedAt: string | null;
};

const initialState: KycState = {
  status: "not-started",
  currentStep: 1,
  personal: { fullName: "", dob: "", country: "", address: "", city: "" },
  documentType: "passport",
  documentFront: null,
  documentBack: null,
  selfie: null,
  rejectionReason: "",
  submittedAt: null,
  approvedAt: null,
};

const steps = [
  { id: 1, label: "Personal Information" },
  { id: 2, label: "Identity Document" },
  { id: 3, label: "Face Verification" },
  { id: 4, label: "Review & Approval" },
];

const statusLabels: Record<VerificationStatus, { label: string; color: string; background: string }> = {
  "not-started": { label: "Not Started", color: "#9CA3AF", background: "rgba(156,163,175,0.12)" },
  pending: { label: "Pending", color: "#F59E0B", background: "rgba(245,158,11,0.12)" },
  verified: { label: "Verified", color: "#10B981", background: "rgba(16,185,129,0.12)" },
  rejected: { label: "Rejected", color: "#EF4444", background: "rgba(239,68,68,0.12)" },
};

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Verification() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const COLORS = useMemo(() => getKycColors(theme), [theme]);
  const S = useMemo(() => getStyles(COLORS), [COLORS]) as Record<string, React.CSSProperties>;
  const [kycState, setKycState] = useState<KycState>(initialState);
  const [uploadError, setUploadError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<{ kycVerified: boolean; kycStatus: string; email?: string; name?: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user profile from API (transferred from navbar)
  const fetchUserProfile = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setUserProfile({
          kycVerified: data.user?.kycVerified || false,
          kycStatus: data.user?.kycStatus || "pending",
          email: data.user?.email,
          name: data.user?.name,
        });
      }
    } catch (err) {
      console.log("Error fetching user profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setKycState(JSON.parse(saved));
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(kycState));
  }, [kycState]);

  const statusMeta = statusLabels[kycState.status];

  const personalValid = useMemo(() => {
    const { fullName, dob, country, address, city } = kycState.personal;
    return Boolean(
      fullName.trim().length > 2 &&
      dob &&
      country &&
      address.trim().length > 5 &&
      city.trim().length > 2
    );
  }, [kycState.personal]);

  const addressMismatch = useMemo(() => {
    const { address, city } = kycState.personal;
    if (!address || !city) return false;
    return !address.toLowerCase().includes(city.toLowerCase());
  }, [kycState.personal]);

  const documentValid = Boolean(kycState.documentFront && kycState.documentBack);
  const selfieValid = Boolean(kycState.selfie);

  const canContinue = (step: number) => {
    if (step === 1) return personalValid;
    if (step === 2) return documentValid;
    if (step === 3) return selfieValid;
    return true;
  };

  const handlePersonalChange = (field: keyof KycState["personal"], value: string) => {
    setKycState((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const setDocumentType = (type: DocumentType) => {
    setKycState((prev) => ({ ...prev, documentType: type }));
  };

  const handleFileInput = async (field: "documentFront" | "documentBack" | "selfie", file: File) => {
    setUploadError("");
    const allowed = ["image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) {
      setUploadError("Only JPG and PNG images are supported.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File too large. Max size is 5MB.");
      return;
    }
    const preview = await readFileAsDataURL(file);
    setKycState((prev) => ({
      ...prev,
      [field]: { name: file.name, type: file.type, size: file.size, preview },
    }));
  };

  const handleDrop = async (field: "documentFront" | "documentBack" | "selfie", event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) await handleFileInput(field, file);
  };

  const removeFile = (field: "documentFront" | "documentBack" | "selfie") => {
    setKycState((prev) => ({ ...prev, [field]: null }));
  };

  const stepContent = () => {
    switch (kycState.currentStep) {
      case 1:
        return (
          <div style={S.stepCard}>
            <div style={S.sectionTitle}>Personal details</div>
            <div style={S.formGrid}>
              <label style={S.inputLabel}>
                Full Name
                <input
                  value={kycState.personal.fullName}
                  onChange={(e) => handlePersonalChange("fullName", e.target.value)}
                  placeholder="Jane Doe"
                  style={S.input}
                />
              </label>
              <label style={S.inputLabel}>
                Date of Birth
                <input
                  type="date"
                  value={kycState.personal.dob}
                  onChange={(e) => handlePersonalChange("dob", e.target.value)}
                  style={S.input}
                />
              </label>
              <label style={S.inputLabel}>
                Country
                <select
                  value={kycState.personal.country}
                  onChange={(e) => handlePersonalChange("country", e.target.value)}
                  style={S.input}
                >
                  <option value="">Select your country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </label>
              <label style={S.inputLabel}>
                Address
                <input
                  value={kycState.personal.address}
                  onChange={(e) => handlePersonalChange("address", e.target.value)}
                  placeholder="123 Market Street"
                  style={S.input}
                />
              </label>
              <label style={S.inputLabel}>
                City
                <input
                  value={kycState.personal.city}
                  onChange={(e) => handlePersonalChange("city", e.target.value)}
                  placeholder="New York"
                  style={S.input}
                />
              </label>
            </div>
            <div style={S.hintText}>
              Keep your address and city accurate so your verification can process smoothly.
            </div>
            {addressMismatch && (
              <div style={S.validationWarning}>
                Address and city do not seem to match. Please double-check your entries.
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div style={S.stepCard}>
            <div style={S.sectionTitle}>Upload your identity document</div>
            <div style={{ ...S.docSelector, gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))" }}>
              {([
                { key: "passport", label: "Passport" },
                { key: "national_id", label: "National ID" },
                { key: "driver_license", label: "Driver License" },
              ] as Array<{ key: DocumentType; label: string }>).map((option) => (
                <button
                  key={option.key}
                  onClick={() => setDocumentType(option.key)}
                  style={{
                    ...S.docTypeButton,
                    height: isMobile ? 44 : 54,
                    fontSize: isMobile ? 12 : 13,
                    borderColor: kycState.documentType === option.key ? "#f0b90b" : "rgba(148,163,184,0.24)",
                    color: kycState.documentType === option.key ? "#111827" : "#cbd5e1",
                    background: kycState.documentType === option.key ? "rgba(240,185,11,0.16)" : "transparent",
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div style={{ ...S.uploadGrid, gridTemplateColumns: isMobile ? "1fr" : "1fr" }}>
              {(["documentFront", "documentBack"] as const).map((field) => {
                const file = kycState[field];
                return (
                  <div key={field} style={{ ...S.uploadCard, padding: isMobile ? 14 : 18 }}>
                    <div style={S.uploadTitle}>{field === "documentFront" ? "Front Side" : "Back Side"}</div>
                    <div
                      style={{ ...S.dropZone, minHeight: isMobile ? 140 : 180 }}
                      onDrop={(event) => handleDrop(field, event)}
                      onDragOver={(event) => event.preventDefault()}
                    >
                      {file ? (
                        <>
                          <img src={file.preview} alt={file.name} style={{ ...S.uploadPreview, maxHeight: isMobile ? 120 : 180 }} />
                          <div style={S.uploadMeta}>{file.name}</div>
                          <button onClick={() => removeFile(field)} style={S.removeButton}>Remove</button>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: isMobile ? 26 : 32 }}>📤</span>
                          <div style={S.dropLabel}>Drag & drop or click to upload</div>
                          <div style={S.dropNote}>JPG, PNG • Max 5MB</div>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (file) await handleFileInput(field, file);
                        }}
                        style={S.fileInput}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={S.hintText}>
              Your document should be sharp, fully visible, and unobstructed.
            </div>
            {uploadError && <div style={S.validationWarning}>{uploadError}</div>}
          </div>
        );
      case 3:
        return (
          <div style={S.stepCard}>
            <div style={S.sectionTitle}>Face verification</div>
            <div style={S.sectionCopy}>
              Upload a clear selfie photo so we can match your face to the document.
            </div>
            <div style={{ ...S.uploadCard, padding: isMobile ? 14 : 18 }}>
              <div style={S.uploadTitle}>Selfie photo</div>
              <div
                style={{ ...S.dropZone, minHeight: isMobile ? 140 : 180 }}
                onDrop={(event) => handleDrop("selfie", event)}
                onDragOver={(event) => event.preventDefault()}
              >
                {kycState.selfie ? (
                  <>
                    <img src={kycState.selfie.preview} alt={kycState.selfie.name} style={{ ...S.uploadPreview, maxHeight: isMobile ? 120 : 180 }} />
                    <div style={S.uploadMeta}>{kycState.selfie.name}</div>
                    <button onClick={() => removeFile("selfie")} style={S.removeButton}>Retake</button>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: isMobile ? 26 : 32 }}>🤳</span>
                    <div style={S.dropLabel}>Drag & drop or click to upload</div>
                    <div style={S.dropNote}>Front camera or gallery image</div>
                  </>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (file) await handleFileInput("selfie", file);
                  }}
                  style={S.fileInput}
                />
              </div>
            </div>
            {uploadError && <div style={S.validationWarning}>{uploadError}</div>}
          </div>
        );
      case 4:
        return (
          <div style={S.stepCard}>
            <div style={S.sectionTitle}>Review & submit</div>
            <div style={{ ...S.summaryList, gap: isMobile ? 10 : 14 }}>
              <div style={{ ...S.summaryItem, padding: isMobile ? "12px 14px" : "16px 18px" }}>
                <div>
                  <div style={S.summaryLabel}>Full Name</div>
                  <div>{kycState.personal.fullName || "—"}</div>
                </div>
                <button onClick={() => setKycState((prev) => ({ ...prev, currentStep: 1 }))} style={S.linkButton}>Edit</button>
              </div>
              <div style={{ ...S.summaryItem, padding: isMobile ? "12px 14px" : "16px 18px" }}>
                <div>
                  <div style={S.summaryLabel}>Country</div>
                  <div>{kycState.personal.country || "—"}</div>
                </div>
                <button onClick={() => setKycState((prev) => ({ ...prev, currentStep: 1 }))} style={S.linkButton}>Edit</button>
              </div>
              <div style={{ ...S.summaryItem, padding: isMobile ? "12px 14px" : "16px 18px" }}>
                <div>
                  <div style={S.summaryLabel}>Document type</div>
                  <div>{kycState.documentType.replace("_", " ")}</div>
                </div>
                <button onClick={() => setKycState((prev) => ({ ...prev, currentStep: 2 }))} style={S.linkButton}>Edit</button>
              </div>
              <div style={{ ...S.summaryItem, padding: isMobile ? "12px 14px" : "16px 18px" }}>
                <div>
                  <div style={S.summaryLabel}>Document upload</div>
                  <div>{documentValid ? "Ready" : "Missing files"}</div>
                </div>
                <button onClick={() => setKycState((prev) => ({ ...prev, currentStep: 2 }))} style={S.linkButton}>Edit</button>
              </div>
              <div style={{ ...S.summaryItem, padding: isMobile ? "12px 14px" : "16px 18px" }}>
                <div>
                  <div style={S.summaryLabel}>Face verification</div>
                  <div>{selfieValid ? "Uploaded" : "Missing selfie"}</div>
                </div>
                <button onClick={() => setKycState((prev) => ({ ...prev, currentStep: 3 }))} style={S.linkButton}>Edit</button>
              </div>
            </div>
            <div style={S.hintText}>
              Make sure everything is accurate before submission. Approval is usually completed within 5–30 minutes.
            </div>
          </div>
        );
      case 5:
        return (
          <div style={S.stepCard}>
            <div style={{ ...S.sectionTitle, marginBottom: 12 }}>Verification Submitted</div>
            <div style={{ ...S.successCard, padding: isMobile ? 18 : 24 }}>
              <div style={{ fontSize: isMobile ? 28 : 32, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 700, marginBottom: 8 }}>Your documents are under review</div>
              <div style={{ color: "#64748b", marginBottom: 16, fontSize: isMobile ? 13 : 14 }}>Thank you — we’re reviewing your identity details now.</div>
              <div style={{ ...S.statusRow, flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 6 : 8 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 84, borderRadius: 999, padding: "6px 12px", background: statusLabels["pending"].background, color: statusLabels["pending"].color, fontSize: 12, fontWeight: 700 }}>Pending</span>
                <span>Estimated review time: 5–30 minutes</span>
              </div>
              <button onClick={() => navigate("/")} style={{ ...S.primaryButton, width: isMobile ? "100%" : "auto", minWidth: isMobile ? undefined : 180 }}>Return to dashboard</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const serializeFile = (file: FilePreview | null) => {
    if (!file) return null;
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      data: file.preview,
    };
  };

  const submitKyc = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUploadError("Please log in before submitting verification.");
        return;
      }

      const payload = {
        personal: kycState.personal,
        documentType: kycState.documentType,
        documentFront: serializeFile(kycState.documentFront),
        documentBack: serializeFile(kycState.documentBack),
        selfie: serializeFile(kycState.selfie)
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/submit-kyc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const body = await response.json();
        setUploadError(body.message || "Failed to submit verification.");
        return;
      }

      setKycState((prev) => ({
        ...prev,
        status: "pending",
        submittedAt: new Date().toISOString(),
        currentStep: 5
      }));
    } catch (error) {
      console.error("KYC submission error:", error);
      setUploadError("Could not submit your verification. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (kycState.currentStep === 4) {
      submitKyc();
      return;
    }
    setKycState((prev) => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 5) }));
  };

  const handleBack = () => {
    if (kycState.currentStep === 5) {
      setKycState((prev) => ({ ...prev, currentStep: 4 }));
      return;
    }
    setKycState((prev) => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 1) }));
  };

  const isStepComplete = (step: number) => {
    if (step === 1) return personalValid;
    if (step === 2) return documentValid;
    if (step === 3) return selfieValid;
    if (step === 4) return documentValid && selfieValid && personalValid;
    return false;
  };

  return (
    <div style={{ ...S.page, padding: isMobile ? "16px" : "24px" }}>
      <div style={S.container}>
        <div style={{ ...S.headerPane, flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "flex-start" }}>
          <div>
            <div style={{ ...S.title, fontSize: isMobile ? 24 : 32 }}>Identity Verification</div>
            <div style={S.subtitle}>Verify your identity to unlock deposits, withdrawals, and trading.</div>
            {userProfile && (
              <div style={{ marginTop: 12, fontSize: 13, color: COLORS.userProfileColor }}>
                {userProfile.name && <div>Welcome, <strong>{userProfile.name}</strong></div>}
                {userProfile.email && <div style={{ marginTop: 4, color: COLORS.userEmailColor }}>{userProfile.email}</div>}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 12, flexDirection: "column", alignItems: isMobile ? "stretch" : "flex-end" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: isMobile ? "flex-start" : "flex-end" }}>
              {userProfile?.kycVerified ? (
                <span style={{ padding: "8px 12px", borderRadius: 12, background: "rgba(16,185,129,0.12)", color: "#10B981", fontSize: 12, fontWeight: 700 }}>✓ Verified</span>
              ) : (
                <span style={{ padding: "8px 12px", borderRadius: 12, background: "rgba(239,68,68,0.12)", color: "#EF4444", fontSize: 12, fontWeight: 700 }}>⚠ Unverified</span>
              )}
              <span style={{ padding: "8px 12px", borderRadius: 12, background: "rgba(240,185,11,0.12)", color: "#F0B90B", fontSize: 12, fontWeight: 700 }}>New</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ padding: "10px 14px", borderRadius: 16, background: statusMeta.background, color: statusMeta.color, fontWeight: 700, fontSize: 12 }}>{statusMeta.label}</div>
              <button onClick={() => navigate("/")} style={S.linkButton}>Back to dashboard</button>
            </div>
          </div>
        </div>

        <div style={S.benefitsBar}>
          {[
            "Enable Trading",
            "Increase Withdrawal Limits",
            "Improve Account Security",
            "Unlock Full Platform Access",
          ].map((label) => (
            <div key={label} style={S.benefitCard}>
              <span style={{ marginRight: 8, fontSize: 16 }}>✔</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Withdrawal Limits Section (transferred from navbar) */}
        <div style={{ ...S.limitsGrid, gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {[
            {
              label: "Daily withdrawal",
              value: userProfile?.kycVerified ? "Unlimited" : "0 USDT",
              sub: userProfile?.kycVerified ? "Verified account" : "Verify to unlock",
            },
            {
              label: "Trading limit",
              value: userProfile?.kycVerified ? "Unlimited" : "Locked",
              sub: userProfile?.kycVerified ? "Full access" : "KYC required",
            },
            {
              label: "Account status",
              value: userProfile?.kycVerified ? "Active" : "Pending",
              sub: userProfile?.kycVerified ? "All features available" : "Complete verification",
            },
            {
              label: "Verification status",
              value: userProfile?.kycStatus ? (userProfile.kycStatus.charAt(0).toUpperCase() + userProfile.kycStatus.slice(1)) : "Pending",
              sub: "Identity document verification",
            },
          ].map((item, idx) => (
            <div key={idx} style={{ ...S.limitCard, padding: isMobile ? "14px 12px" : "18px 16px" }}>
              <div style={{ fontSize: isMobile ? 11 : 12, color: COLORS.textMuted, marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</div>
              <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 700, color: COLORS.limitValueColor, marginBottom: 4 }}>{item.value}</div>
              <div style={{ fontSize: isMobile ? 11 : 12, color: COLORS.textHint }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ ...S.mainGrid, gridTemplateColumns: isMobile ? "1fr" : "320px 1fr" }}>
          <div style={{ ...S.sidebarCard, padding: isMobile ? 18 : 24 }}>
            <div style={S.stepperLabel}>Progress</div>
            <div style={{ ...S.stepper, flexDirection: isMobile ? "row" : "column", flexWrap: "wrap", gap: isMobile ? 8 : 12 }}>
              {steps.map((step) => (
                <div key={step.id} style={{ ...stepItemStyle(kycState.currentStep, step.id, isStepComplete(step.id), COLORS), flex: isMobile ? "1 1 auto" : undefined }}>
                  <div style={{ ...S.stepNumber, width: isMobile ? 28 : 32, height: isMobile ? 28 : 32, fontSize: isMobile ? 11 : 14 }}>{step.id}</div>
                  <div>
                    <div style={{ ...S.stepName, fontSize: isMobile ? 12 : 14 }}>{step.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={S.sidebarNote}>
              Your progress is saved automatically.
            </div>
          </div>

          <div style={{ ...S.bodyCard, padding: isMobile ? 18 : 26 }}>
            {stepContent()}
            {kycState.currentStep !== 5 && (
              <div style={{ ...S.actionBar, flexDirection: isMobile ? "column-reverse" : "row" }}>
                <button onClick={handleBack} disabled={kycState.currentStep === 1} style={{ ...S.secondaryButton, width: isMobile ? "100%" : "auto", minWidth: isMobile ? undefined : 140, opacity: kycState.currentStep === 1 ? 0.4 : 1, cursor: kycState.currentStep === 1 ? "not-allowed" : "pointer" }}>Back</button>
                <button
                  onClick={handleNext}
                  disabled={!canContinue(kycState.currentStep) || submitting}
                  style={{ ...S.primaryButton, width: isMobile ? "100%" : "auto", minWidth: isMobile ? undefined : 180, opacity: canContinue(kycState.currentStep) && !submitting ? 1 : 0.6, cursor: canContinue(kycState.currentStep) && !submitting ? "pointer" : "not-allowed" }}
                >
                  {submitting ? "Submitting..." : kycState.currentStep === 4 ? "Submit Verification" : "Continue"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStyles(colors: ReturnType<typeof getKycColors>): Record<string, React.CSSProperties> {
  const s: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: colors.gradientBg,
      color: colors.textPrimary,
      padding: "24px",
      fontFamily: "Inter, system-ui, sans-serif",
    },
    container: {
      maxWidth: 1180,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: 22,
    },
    headerPane: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 18,
      flexWrap: "wrap",
    },
    title: {
      fontSize: 32,
      fontWeight: 800,
      color: colors.stepperLabelColor,
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      maxWidth: 520,
      lineHeight: 1.6,
    },
    benefitsBar: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 14,
    },
    benefitCard: {
      display: "flex",
      alignItems: "center",
      minHeight: 72,
      padding: "16px",
      borderRadius: 18,
      background: colors.benefitCardBg,
      color: colors.benefitCardColor,
      boxShadow: colors.benefitCardShadow,
      fontWeight: 600,
    },
    mainGrid: {
      display: "grid",
      gridTemplateColumns: "320px 1fr",
      gap: 18,
    },
    sidebarCard: {
      padding: 24,
      borderRadius: 24,
      background: colors.cardBg === "#ffffff" ? "#ffffff" : "rgba(255,255,255,0.08)",
      border: `1px solid ${colors.cardBorder}`,
      backdropFilter: "blur(20px)",
    },
    sidebarNote: {
      marginTop: 18,
      color: colors.textMuted,
      fontSize: 13,
      lineHeight: 1.6,
    },
    stepperLabel: {
      color: colors.stepperLabelColor,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      marginBottom: 14,
    },
    stepper: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
    stepNumber: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      display: "grid",
      placeItems: "center",
      color: colors.stepperLabelColor,
      background: "rgba(240,185,11,0.22)",
      fontWeight: 700,
    },
    stepName: {
      fontSize: 14,
      color: colors.textPrimary,
    },
    bodyCard: {
      display: "flex",
      flexDirection: "column",
      gap: 18,
      padding: 26,
      borderRadius: 24,
      background: colors.cardBg,
      border: `1px solid ${colors.cardBorder}`,
      backdropFilter: "blur(20px)",
    },
    stepCard: {
      display: "flex",
      flexDirection: "column",
      gap: 18,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 700,
      color: colors.stepperLabelColor,
    },
    sectionCopy: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 1.8,
    },
    formGrid: {
      display: "grid",
      gap: 16,
    },
    inputLabel: {
      display: "grid",
      gap: 8,
      fontSize: 13,
      color: colors.textSecondary,
    },
    input: {
      width: "100%",
      minHeight: 48,
      borderRadius: 14,
      border: `1px solid ${colors.inputBorder}`,
      background: colors.inputBg,
      padding: "0 14px",
      color: colors.inputColor,
      fontSize: 14,
      outline: "none",
    },
    docSelector: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: 12,
    },
    docTypeButton: {
      height: 54,
      borderRadius: 16,
      border: `1px solid ${colors.cardBorderLight}`,
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 600,
    },
    uploadGrid: {
      display: "grid",
      gap: 16,
    },
    uploadCard: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: 18,
      borderRadius: 20,
      border: `1px solid ${colors.cardBorder}`,
      background: colors.inputBg,
    },
    uploadTitle: {
      fontSize: 13,
      fontWeight: 700,
      color: colors.uploadTitleColor,
    },
    dropZone: {
      minHeight: 180,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      borderRadius: 18,
      border: `2px dashed ${colors.cardBorderLighter}`,
      background: colors.dropzoneBg,
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
    },
    dropLabel: {
      fontSize: 14,
      fontWeight: 700,
      color: colors.uploadTitleColor,
    },
    dropNote: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    fileInput: {
      position: "absolute",
      inset: 0,
      opacity: 0,
      width: "100%",
      height: "100%",
      cursor: "pointer",
    },
    uploadPreview: {
      width: "100%",
      maxHeight: 180,
      objectFit: "contain",
      borderRadius: 14,
      background: colors.previewBg,
    },
    uploadMeta: {
      fontSize: 13,
      color: colors.uploadTitleColor,
      textAlign: "center",
    },
    removeButton: {
      marginTop: 8,
      padding: "10px 14px",
      borderRadius: 14,
      border: `1px solid ${colors.removeBtnBorder}`,
      background: colors.removeBtnBg,
      color: colors.removeBtnColor,
      cursor: "pointer",
      fontWeight: 700,
    },
    actionBar: {
      marginTop: 12,
      display: "flex",
      justifyContent: "space-between",
      gap: 12,
      flexWrap: "wrap",
    },
    primaryButton: {
      minWidth: 180,
      borderRadius: 16,
      border: "none",
      background: "#f0b90b",
      color: "#0f172a",
      padding: "14px 24px",
      fontSize: 15,
      fontWeight: 700,
      cursor: "pointer",
    },
    secondaryButton: {
      minWidth: 140,
      borderRadius: 16,
      border: `1px solid ${colors.secondaryBtnBorder}`,
      background: colors.secondaryBtnBg,
      color: colors.secondaryBtnColor,
      padding: "14px 24px",
      fontSize: 15,
      cursor: "pointer",
    },
    linkButton: {
      border: "none",
      background: "transparent",
      color: "#f0b90b",
      textDecoration: "underline",
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 700,
    },
    summaryList: {
      display: "grid",
      gap: 14,
    },
    summaryItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 18px",
      borderRadius: 18,
      border: `1px solid ${colors.cardBorder}`,
      background: colors.summaryItemBg,
    },
    summaryLabel: {
      fontSize: 12,
      color: colors.textHint,
      marginBottom: 4,
    },
    successCard: {
      padding: 24,
      borderRadius: 24,
      background: colors.successCardBg,
      color: colors.successTextColor,
      textAlign: "center",
    },
    statusRow: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 18,
      color: colors.textSecondary,
    },
    hintText: {
      color: colors.textHint,
      fontSize: 13,
      lineHeight: 1.7,
    },
    validationWarning: {
      padding: "12px 14px",
      borderRadius: 16,
      background: "rgba(248,113,113,0.12)",
      color: "#b91c1c",
      fontSize: 13,
    },
    limitsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: 14,
    },
    limitCard: {
      padding: "18px 16px",
      borderRadius: 18,
      background: colors.limitCardBg,
      border: `1px solid ${colors.limitCardBorder}`,
      backdropFilter: "blur(20px)",
    },
  };
  return s;
}

function stepItemStyle(current: number, step: number, complete: boolean, colors: ReturnType<typeof getKycColors>): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    borderRadius: 16,
    border: complete ? `1px solid ${colors.stepBorderComplete}` : `1px solid ${colors.cardBorderStep}`,
    background: current === step ? colors.stepBgActive : colors.stepBgInactive,
  };
}

export default Verification;
