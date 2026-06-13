"use client";

import { useState } from "react";
import { Camera, Pencil, Check, X, User } from "lucide-react";

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];

export default function ProfileInfo() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved]     = useState(false);

  const [form, setForm] = useState({
    name:   "Jidnyasa Patel",
    age:    "24",
    gender: "Female",
    phone:  "+91 98765 43210",
    email:  "jidnyasa@email.com",
  });
  const [draft, setDraft] = useState({ ...form });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!draft.name.trim())    e.name  = "Name is required";
    if (!draft.age || isNaN(Number(draft.age)) || +draft.age < 1 || +draft.age > 120)
      e.age = "Enter a valid age";
    if (!draft.phone.replace(/\D/g, "").match(/^\d{10}$/))
      e.phone = "Enter a valid 10-digit number";
    if (!draft.email.includes("@")) e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setForm({ ...draft });
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setDraft({ ...form });
    setErrors({});
    setEditing(false);
  };

  const inp = (err?: string): React.CSSProperties => ({
    width: "100%", padding: "10px 14px", fontSize: "14px", color: "#181d2a",
    border: `1.5px solid ${err ? "#dc2626" : "#e8ebed"}`, borderRadius: "10px",
    background: "#fff", outline: "none",
  });

  return (
    <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e8ebed", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "20px 22px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#181d2a", margin: 0 }}>Profile Information</h2>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: "2px 0 0" }}>Manage your personal details</p>
        </div>
        {!editing && (
          <button onClick={() => { setDraft({ ...form }); setEditing(true); }}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity focus:outline-none"
            style={{ background: "rgba(116,142,254,0.08)", color: "#748efe", border: "1px solid rgba(116,142,254,0.2)", borderRadius: "9px", padding: "7px 14px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
            <Pencil size={13} /> Edit
          </button>
        )}
      </div>

      <div style={{ padding: "22px" }}>
        {/* Avatar row */}
        <div className="flex items-center gap-5 mb-6">
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg,#748efe,#2d3560)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={36} style={{ color: "white" }} />
            </div>
            {editing && (
              <button aria-label="Change photo"
                style={{ position: "absolute", bottom: 0, right: 0, width: "26px", height: "26px", borderRadius: "50%", background: "#181d2a", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Camera size={12} style={{ color: "white" }} />
              </button>
            )}
          </div>
          <div>
            <p style={{ fontSize: "18px", fontWeight: 700, color: "#181d2a" }}>{form.name}</p>
            <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "2px" }}>{form.email}</p>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "6px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: "9999px", padding: "2px 10px", fontSize: "11px", fontWeight: 600 }}>
              <Check size={11} /> Verified account
            </span>
          </div>
        </div>

        {/* Fields grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full name */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "5px", letterSpacing: "0.04em" }}>FULL NAME</label>
            {editing
              ? <>
                  <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} style={inp(errors.name)} />
                  {errors.name && <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "3px" }}>{errors.name}</p>}
                </>
              : <p style={{ fontSize: "14px", fontWeight: 500, color: "#181d2a" }}>{form.name}</p>}
          </div>

          {/* Age */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "5px", letterSpacing: "0.04em" }}>AGE</label>
            {editing
              ? <>
                  <input type="number" value={draft.age} onChange={(e) => setDraft({ ...draft, age: e.target.value })} style={inp(errors.age)} placeholder="e.g. 24" />
                  {errors.age && <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "3px" }}>{errors.age}</p>}
                </>
              : <p style={{ fontSize: "14px", fontWeight: 500, color: "#181d2a" }}>{form.age} years</p>}
          </div>

          {/* Gender */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "5px", letterSpacing: "0.04em" }}>GENDER</label>
            {editing
              ? <select value={draft.gender} onChange={(e) => setDraft({ ...draft, gender: e.target.value })}
                  style={{ ...inp(), color: "#181d2a" }}>
                  {GENDER_OPTIONS.map((g) => <option key={g}>{g}</option>)}
                </select>
              : <p style={{ fontSize: "14px", fontWeight: 500, color: "#181d2a" }}>{form.gender}</p>}
          </div>

          {/* Phone */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "5px", letterSpacing: "0.04em" }}>PHONE NUMBER</label>
            {editing
              ? <>
                  <input type="tel" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} style={inp(errors.phone)} placeholder="+91 XXXXX XXXXX" />
                  {errors.phone && <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "3px" }}>{errors.phone}</p>}
                </>
              : <p style={{ fontSize: "14px", fontWeight: 500, color: "#181d2a" }}>{form.phone}</p>}
          </div>

          {/* Email — full width */}
          <div className="sm:col-span-2">
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "5px", letterSpacing: "0.04em" }}>EMAIL ADDRESS</label>
            {editing
              ? <>
                  <input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} style={inp(errors.email)} placeholder="you@email.com" />
                  {errors.email && <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "3px" }}>{errors.email}</p>}
                </>
              : <p style={{ fontSize: "14px", fontWeight: 500, color: "#181d2a" }}>{form.email}</p>}
          </div>
        </div>

        {/* Action row */}
        {editing && (
          <div className="flex items-center gap-3 mt-5 pt-4" style={{ borderTop: "1px solid #f3f4f6" }}>
            <button onClick={handleSave}
              className="flex items-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all focus:outline-none"
              style={{ background: "#748efe", color: "#fff", borderRadius: "10px", padding: "10px 22px", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer" }}>
              <Check size={15} /> Save Changes
            </button>
            <button onClick={handleCancel}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
              style={{ background: "#f8fafc", color: "#6b7280", border: "1px solid #e8ebed", borderRadius: "10px", padding: "10px 18px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
              <X size={14} /> Cancel
            </button>
          </div>
        )}

        {/* Save success toast */}
        {saved && (
          <div className="flex items-center gap-2 mt-4" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "10px 14px" }}>
            <Check size={15} style={{ color: "#16a34a" }} />
            <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: 600 }}>Profile updated successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
}
