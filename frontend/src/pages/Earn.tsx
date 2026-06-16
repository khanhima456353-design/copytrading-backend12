import React, { useEffect, useState, useMemo } from "react";
import { useTheme } from "../components/theme/ThemeContext";
import {
  Wallet, TrendingUp, Clock, Calendar, CheckCircle, XCircle,
  ChevronRight, Shield, Zap, BarChart3, Lock, Coins,
  ArrowRight, Gift, Sparkles, Loader2
} from "lucide-react";
import { getAxios } from "../api";

const DURATION = 45;

const TIERS = [
  { min: 1000,   max: 4999,   label: "$1,000",    rate: 5  },
  { min: 5000,   max: 9999,   label: "$5,000",    rate: 10 },
  { min: 10000,  max: 14999,  label: "$10,000",   rate: 15 },
  { min: 15000,  max: 19999,  label: "$15,000",   rate: 20 },
  { min: 20000,  max: 24999,  label: "$20,000",   rate: 25 },
  { min: 25000,  max: 999999, label: "$25,000+",  rate: 30 },
];

const COLORS_LIGHT = {
  bg: "#ffffff", panel: "#f8f9fa", card: "#ffffff", border: "#e2e8f0",
  text: "#475569", textBright: "#0f172a", textMuted: "#94a3b8",
  green: "#0ecb81", red: "#f6465d", gold: "#f0b90b", goldDim: "rgba(240,185,11,0.1)",
};

const COLORS_DARK = {
  bg: "#0b0e11", panel: "#161a1e", card: "#1a1e24", border: "#2a2e35",
  text: "#848e9c", textBright: "#eaecef", textMuted: "#474d57",
  green: "#0ecb81", red: "#f6465d", gold: "#f0b90b", goldDim: "rgba(240,185,11,0.1)",
};

function Earn() {
  const { theme } = useTheme();
  const C = theme === "light" ? COLORS_LIGHT : COLORS_DARK;

  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState<number | "">("");
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [stakes, setStakes] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [staking, setStaking] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchData = async () => {
    try {
      const api = await getAxios();
      const [walletRes, stakesRes, summaryRes] = await Promise.all([
        api.get("/api/wallet"),
        api.get("/api/earn/stakes"),
        api.get("/api/earn/summary"),
      ]);
      setBalance(walletRes.data?.data?.availableBalance || 0);
      setStakes(stakesRes.data?.data?.stakes || []);
      setSummary(summaryRes.data?.data?.summary || null);
    } catch (e) {
      console.error("Earn fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const currentTier = useMemo(() => {
    const num = typeof amount === "number" ? amount : 0;
    return TIERS.find((t) => num >= t.min && num <= t.max) || null;
  }, [amount]);

  const calculation = useMemo(() => {
    const num = typeof amount === "number" ? amount : 0;
    if (!currentTier || num <= 0) return null;
    const total = (num * currentTier.rate) / 100;
    return { total, daily: total / DURATION };
  }, [amount, currentTier]);

  const handleStake = async () => {
    const num = typeof amount === "number" ? amount : 0;
    if (num <= 0) { setError("Enter an amount"); return; }
    if (num < 1000) { setError("Minimum stake is $1,000"); return; }
    if (num > balance) { setError("Insufficient balance"); return; }
    setError(""); setSuccessMsg(""); setStaking(true);
    try {
      const api = await getAxios();
      await api.post("/api/earn/create", { amount: num });
      setSuccessMsg(`Successfully staked $${num.toLocaleString()} USDT!`);
      setAmount(""); setSelectedTier(null);
      await fetchData();
    } catch (e: any) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setStaking(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={32} className="animate-spin" color={C.gold} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textBright, fontFamily: "'IBM Plex Sans','Helvetica Neue',sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px 60px" }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 12 }}>
              <Sparkles size={28} color={C.gold} /> Earn
            </h1>
            <p style={{ color: C.text, fontSize: 14, margin: "4px 0 0" }}>Stake USDT and earn daily rewards over {DURATION} days</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: C.panel, borderRadius: 10, border: `1px solid ${C.border}` }}>
            <Wallet size={16} color={C.gold} />
            <span style={{ color: C.text, fontSize: 13 }}>Available</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* stats */}
        {summary && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 36 }}>
            {[
              { label: "Total Staked", value: `$${summary.totalStaked.toLocaleString()}`, icon: Coins },
              { label: "Active Stakes", value: summary.activeCount.toString(), icon: BarChart3 },
              { label: "Total Earned", value: `$${summary.totalEarned.toFixed(2)}`, icon: Gift },
              { label: "Pending Today", value: `$${summary.pendingToday.toFixed(2)}`, icon: Clock },
            ].map((s) => (
              <div key={s.label} style={{ padding: "16px 18px", background: C.card, borderRadius: 10, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <s.icon size={16} color={C.gold} />
                  <span style={{ color: C.text, fontSize: 12 }}>{s.label}</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* main card: tiers + calc */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 36 }}>
          {/* tiers */}
          <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <Zap size={18} color={C.gold} /> Choose your stake amount
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TIERS.map((tier) => {
                const active = selectedTier === tier.min;
                return (
                  <button key={tier.min} onClick={() => { setSelectedTier(tier.min); setAmount(tier.min); setError(""); }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px",
                      background: active ? C.goldDim : "transparent", border: `1px solid ${active ? C.gold : C.border}`,
                      borderRadius: 10, cursor: "pointer", transition: "all 0.15s", textAlign: "left", width: "100%" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, color: C.textBright }}>{tier.label}</div>
                      <div style={{ fontSize: 12, color: C.text, marginTop: 2 }}>{tier.rate}% over {DURATION} days</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.gold }}>
                        ${((tier.min * tier.rate) / 100).toLocaleString()}
                      </span>
                      <ChevronRight size={16} color={active ? C.gold : C.textMuted} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* calculator */}
          <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <BarChart3 size={18} color={C.gold} /> Calculator
            </h2>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: C.text, display: "block", marginBottom: 6 }}>Custom amount (USDT)</label>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.textMuted, fontSize: 14 }}>$</span>
                  <input type="number" placeholder="e.g. 3500" value={amount}
                    onChange={(e) => { const v = e.target.value; setAmount(v ? Number(v) : ""); setSelectedTier(null); setError(""); }}
                    style={{ width: "100%", padding: "12px 12px 12px 28px", background: C.panel, border: `1px solid ${C.border}`,
                      borderRadius: 8, color: C.textBright, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
            </div>
            {currentTier && calculation && (
              <div style={{ background: C.panel, borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: C.text, fontSize: 13 }}>Tier rate</span>
                  <span style={{ fontWeight: 600 }}>{currentTier.rate}%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: C.text, fontSize: 13 }}>Total earn ({DURATION} days)</span>
                  <span style={{ fontWeight: 700, color: C.green, fontSize: 16 }}>${calculation.total.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
                  <span style={{ color: C.text, fontSize: 13 }}>Daily earn</span>
                  <span style={{ fontWeight: 600, color: C.gold }}>${calculation.daily.toFixed(2)} / day</span>
                </div>
              </div>
            )}
            {error && <div style={{ color: C.red, fontSize: 13, marginBottom: 12 }}>{error}</div>}
            {successMsg && <div style={{ color: C.green, fontSize: 13, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><CheckCircle size={14} /> {successMsg}</div>}
            <button onClick={handleStake} disabled={staking || !amount || amount < 1000}
              style={{ width: "100%", padding: "14px", background: staking ? C.textMuted : C.gold, border: "none", borderRadius: 10,
                color: "#000", fontWeight: 700, fontSize: 15, cursor: staking ? "not-allowed" : "pointer", display: "flex",
                alignItems: "center", justifyContent: "center", gap: 8 }}>
              {staking ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />}
              {staking ? "Staking..." : "Stake USDT"}
            </button>
          </div>
        </div>

        {/* how it works */}
        <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 24, marginBottom: 36 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <Shield size={18} color={C.gold} /> How it works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {[
              { step: "1", icon: Wallet, title: "Stake USDT", desc: "Choose an amount from $1,000 up to $25,000+. Your USDT is locked for 45 days." },
              { step: "2", icon: TrendingUp, title: "Earn daily", desc: `Every day, your daily earn is automatically credited to your wallet — no manual claims needed.` },
              { step: "3", icon: BarChart3, title: "Track progress", desc: "Monitor your active stakes, daily earnings, and total rewards in real-time." },
              { step: "4", icon: Gift, title: "Collect rewards", desc: "At the end of 45 days, your stake is unlocked. All earnings are already in your wallet." },
            ].map((s) => (
              <div key={s.step} style={{ display: "flex", gap: 14, padding: 16, background: C.panel, borderRadius: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: C.goldDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <s.icon size={18} color={C.gold} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 2 }}>STEP {s.step}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ color: C.text, fontSize: 13, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* active stakes */}
        {stakes.length > 0 && (
          <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 24, marginBottom: 36 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <BarChart3 size={18} color={C.gold} /> Your stakes
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {stakes.map((stake: any) => {
                const start = new Date(stake.startDate);
                const end = new Date(stake.endDate);
                const now = Date.now();
                const totalMs = end.getTime() - start.getTime();
                const elapsedMs = now - start.getTime();
                const progress = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));
                const daysLeft = Math.max(0, Math.ceil((end.getTime() - now) / (1000 * 60 * 60 * 24)));
                const daysActive = Math.min(45, Math.floor(elapsedMs / (1000 * 60 * 60 * 24)) + 1);

                return (
                  <div key={stake._id} style={{ padding: 16, background: C.panel, borderRadius: 10, border: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>${stake.amount.toLocaleString()} USDT</div>
                        <div style={{ color: C.text, fontSize: 12, marginTop: 2 }}>{stake.rate}% APR &middot; {daysActive}/{DURATION} days elapsed</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.green }}>${(stake.claimedAmount || 0).toFixed(2)} earned</div>
                        <div style={{ color: C.text, fontSize: 12 }}>{daysLeft}d remaining</div>
                      </div>
                    </div>
                    <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${C.gold}, ${C.green})`, borderRadius: 3, transition: "width 0.5s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <Shield size={18} color={C.gold} /> FAQ
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { q: "What is the minimum stake?", a: "The minimum stake is $1,000 USDT." },
              { q: "How are earnings calculated?", a: `Total earn = stake amount × rate ÷ 100. Daily earn = total earn ÷ ${DURATION}. For example, $1,000 at 5% earns $50 total, paid as $1.11/day.` },
              { q: "When are earnings paid?", a: "Earnings are credited to your wallet automatically every day. No manual claim required." },
              { q: "Can I withdraw my stake early?", a: "No — the stake is locked for the full 45 days. Earnings are paid daily regardless." },
              { q: "What happens after 45 days?", a: "The stake is marked as completed. All earnings have already been paid to your wallet during the period. The staked amount remains available in your wallet." },
              { q: "Is there any risk?", a: "Your staked USDT is securely held in the Earn contract. Daily earnings are guaranteed based on the tier rate." },
            ].map((faq) => (
              <details key={faq.q} style={{ padding: "12px 16px", background: C.panel, borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer" }}>
                <summary style={{ fontWeight: 600, fontSize: 14, color: C.textBright }}>{faq.q}</summary>
                <p style={{ color: C.text, fontSize: 13, margin: "8px 0 0", lineHeight: 1.6 }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Earn;
