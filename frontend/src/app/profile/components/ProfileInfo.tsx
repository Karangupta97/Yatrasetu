"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X, Plus } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];

interface DraftFields {
  fullName: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
}

interface FieldErrors {
  fullName?: string;
  age?: string;
  phone?: string;
  email?: string;
}

/* ── Field display with "Not provided" fallback ──────────────── */
function FieldValue({
  value,
  onAddClick,
}: {
  value: string | null | undefined;
  onAddClick?: () => void;
}) {
  if (value) {
    return (
      <p style={{ fontSize: "15px", color: "#181d2a", margin: 0, lineHeight: "1.5" }}>
        {value}
      </p>
    );
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
      <span style={{ fontSize: "15px", color: "#9ca3af", fontStyle: "italic" }}>Not provided</span>
      {onAddClick && (
        <button
          onClick={onAddClick}
          style={{
            display: "inline-flex", alignItems: "center", gap: "2px",
            fontSize: "12px", color: "#6366F1", fontWeight: 600,
            background: "none", border: "none", cursor: "pointer", padding: "0 4px",
          }}
        >
          <Plus size={11} /> Add
        </button>
      )}
    </span>
  );
}

/* ── Inline input with error ─────────────────────────────────── */
function FieldInput({
  value, onChange, type = "text", placeholder, error,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "10px 14px", fontSize: "14px",
          color: "#181d2a",
          border: `1.5px solid ${error ? "#dc2626" : "#e8ebed"}`,
          borderRadius: "10px", background: "#fff", outline: "none",
          transition: "border-color 0.15s",
          fontFamily: "inherit",
        }}
        className="profile-input"
      />
      {error && (
        <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "3px" }}>{error}</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
export default function ProfileInfo() {
  const profile = useUserProfile();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState<DraftFields>({
    fullName: "", age: "", gender: "", phone: "", email: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  // Sync draft from profile when entering edit mode
  function startEdit() {
    setDraft({
      fullName: profile.fullName  ?? "",
      age:      profile.age       ?? "",
      gender:   profile.gender    ?? "",
      phone:    profile.phone     ?? "",
      email:    profile.email     ?? "",
    });
    setErrors({});
    setEditing(true);
  }

  function validate(): boolean {
    const e: FieldErrors = {};
    if (!draft.fullName.trim()) e.fullName = "Name is required";
    if (draft.age && (isNaN(Number(draft.age)) || +draft.age < 1 || +draft.age > 120)) {
      e.age = "Enter a valid age (1–120)";
    }
    if (draft.phone && !draft.phone.replace(/\D/g, "").match(/^\d{10}$/)) {
      e.phone = "Enter a valid 10-digit mobile number";
    }
    if (!draft.email.includes("@")) e.email = "Enter a valid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    profile.updateProfile({
      fullName: draft.fullName || undefined,
      email:    draft.email    || undefined,
      phone:    draft.phone    || undefined,
      age:      draft.age      || undefined,
      gender:   draft.gender   || undefined,
    });
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleCancel() {
    setErrors({});
    setEditing(false);
  }

  const fieldLabel: React.CSSProperties = {
    fontSize: "11px", fontWeight: 600, color: "#9ca3af",
    letterSpacing: "0.07em", textTransform: "uppercase",
    display: "block", marginBottom: "5px",
  };

  const fieldWrapper: React.CSSProperties = {
    borderBottom: "1px solid #F3F4F6",
    paddingBottom: "16px",
    marginBottom: "4px",
  };

  return (
    <div
      style={{
        background: "#fff", borderRadius: "16px",
        border: "1px solid #e8ebed",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      {/* ── Header ─────────────────────────────────── */}
      <div
        style={{
          padding: "24px 28px 20px",
          borderBottom: "1px solid #F3F4F6",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        }}
      >
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#181d2a", margin: "0 0 4px" }}>
            Profile Information
          </h2>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
            Manage your personal details
          </p>
        </div>
        {!editing && (
          <button
            onClick={startEdit}
            className="edit-btn"
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "13px", fontWeight: 600, color: "#6366F1",
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.18)",
              borderRadius: "9px", padding: "8px 16px",
              cursor: "pointer", fontFamily: "inherit",
              transition: "background 0.15s",
            }}
          >
            <Pencil size={13} /> Edit
          </button>
        )}
      </div>

      <div style={{ padding: "28px" }}>
        {/* ── User display row ────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "28px" }}>
          {/* Avatar */}
          <div
            style={{
              width: "72px", height: "72px", borderRadius: "50%", flexShrink: 0,
              background: profile.avatarColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(99,102,241,0.25)",
            }}
          >
            <span style={{ fontSize: "28px", fontWeight: 700, color: "white" }}>
              {profile.initials}
            </span>
          </div>
          <div>
            <p style={{ fontSize: "20px", fontWeight: 700, color: "#181d2a", margin: "0 0 3px" }}>
              {profile.displayName}
            </p>
            <p style={{ fontSize: "14px", color: "#9ca3af", margin: "0 0 8px" }}>
              {profile.email ?? "No email set"}
            </p>
            {profile.isEmailVerified && (
              <span
                style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  background: "#f0fdf4", color: "#16a34a",
                  border: "1px solid #bbf7d0", borderRadius: "9999px",
                  padding: "2px 10px", fontSize: "11px", fontWeight: 600,
                }}
              >
                <Check size={10} /> Verified account
              </span>
            )}
          </div>
        </div>

        {/* ── Fields grid ─────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>

          {/* Full Name */}
          <div style={fieldWrapper}>
            <label style={fieldLabel}>Full Name</label>
            {editing
              ? <FieldInput value={draft.fullName} onChange={(v) => setDraft({ ...draft, fullName: v })} placeholder="Your full name" error={errors.fullName} />
              : <FieldValue value={profile.fullName} onAddClick={startEdit} />}
          </div>

          {/* Age */}
          <div style={fieldWrapper}>
            <label style={fieldLabel}>Age</label>
            {editing
              ? <FieldInput type="number" value={draft.age} onChange={(v) => setDraft({ ...draft, age: v })} placeholder="e.g. 24" error={errors.age} />
              : <FieldValue value={profile.age ? `${profile.age} years` : null} onAddClick={startEdit} />}
          </div>

          {/* Gender */}
          <div style={fieldWrapper}>
            <label style={fieldLabel}>Gender</label>
            {editing
              ? (
                <select
                  value={draft.gender}
                  onChange={(e) => setDraft({ ...draft, gender: e.target.value })}
                  style={{
                    width: "100%", padding: "10px 14px", fontSize: "14px",
                    color: draft.gender ? "#181d2a" : "#9ca3af",
                    border: "1.5px solid #e8ebed",
                    borderRadius: "10px", background: "#fff", outline: "none",
                    fontFamily: "inherit",
                  }}
                >
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              )
              : <FieldValue value={profile.gender} onAddClick={startEdit} />}
          </div>

          {/* Phone */}
          <div style={fieldWrapper}>
            <label style={fieldLabel}>Phone Number</label>
            {editing
              ? <FieldInput type="tel" value={draft.phone} onChange={(v) => setDraft({ ...draft, phone: v })} placeholder="+91 XXXXX XXXXX" error={errors.phone} />
              : <FieldValue value={profile.phone} onAddClick={startEdit} />}
          </div>

          {/* Email — full width */}
          <div style={{ ...fieldWrapper, gridColumn: "1 / -1" }}>
            <label style={fieldLabel}>Email Address</label>
            {editing
              ? <FieldInput type="email" value={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} placeholder="you@email.com" error={errors.email} />
              : <FieldValue value={profile.email} onAddClick={startEdit} />}
          </div>
        </div>

        {/* ── Edit actions ─────────────────────────── */}
        {editing && (
          <div
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              marginTop: "20px", paddingTop: "20px",
              borderTop: "1px solid #F3F4F6",
            }}
            className="edit-actions"
          >
            <button
              onClick={handleSave}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "#6366F1", color: "#fff", borderRadius: "10px",
                padding: "10px 22px", fontSize: "14px", fontWeight: 700,
                border: "none", cursor: "pointer", fontFamily: "inherit",
                transition: "opacity 0.15s, transform 0.15s",
              }}
              className="save-btn"
            >
              <Check size={15} /> Save Changes
            </button>
            <button
              onClick={handleCancel}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: "#f8fafc", color: "#6b7280",
                border: "1px solid #e8ebed", borderRadius: "10px",
                padding: "10px 18px", fontSize: "14px", fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                transition: "background 0.15s",
              }}
            >
              <X size={14} /> Cancel
            </button>
          </div>
        )}

        {/* ── Save success toast ───────────────────── */}
        {saved && (
          <div
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              marginTop: "16px", background: "#f0fdf4",
              border: "1px solid #bbf7d0", borderRadius: "10px",
              padding: "11px 16px",
            }}
            className="save-toast"
          >
            <Check size={15} style={{ color: "#16a34a" }} />
            <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: 600 }}>
              Profile updated successfully!
            </span>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .profile-input:focus {
          border-color: #6366F1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .edit-btn:hover { background: rgba(99,102,241,0.12) !important; }
        .save-btn:hover  { opacity: 0.88; }
        .save-btn:active { transform: scale(0.97); }
        .save-toast { animation: toast-in 0.2s ease; }
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .save-toast { animation: none; }
        }
        @media (max-width: 600px) {
          .profile-info-grid { grid-template-columns: 1fr !important; }
        }
      `}} />
    </div>
  );
}
