"use client";

import { useState } from "react";
import { UserPlus, Trash2, User, Phone, Mail } from "lucide-react";
import StepCard, { FieldLabel, FieldInput, FieldSelect, NavButtons } from "../components/StepCard";
import { BookingState, Passenger } from "../types";

const GENDER_OPTIONS = [
  { value: "",       label: "Select gender" },
  { value: "Male",   label: "Male"          },
  { value: "Female", label: "Female"        },
  { value: "Other",  label: "Other"         },
];

function makePassenger(id: string): Passenger {
  return { id, name: "", age: "", gender: "", idType: "", idNumber: "", kycVerified: false };
}

export default function Step2Passengers({
  state, setState, onNext, onBack,
}: {
  state: BookingState;
  setState: (s: Partial<BookingState>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const updatePassenger = (idx: number, field: keyof Passenger, value: string) => {
    const updated = [...state.passengerDetails];
    updated[idx] = { ...updated[idx], [field]: value };
    setState({ passengerDetails: updated });
  };

  const addPassenger = () => {
    if (state.passengerDetails.length >= state.passengers) return;
    setState({ passengerDetails: [...state.passengerDetails, makePassenger(Date.now().toString())] });
  };

  const removePassenger = (idx: number) => {
    if (state.passengerDetails.length <= 1) return;
    const updated = [...state.passengerDetails];
    updated.splice(idx, 1);
    setState({ passengerDetails: updated });
  };

  const validate = () => {
    const errs: typeof errors = {};

    // Validate each passenger — only Name, Age, Gender
    state.passengerDetails.forEach((p, i) => {
      const e: Record<string, string> = {};
      if (!p.name.trim()) e.name = "Name is required";
      if (!p.age.trim())  e.age  = "Age is required";
      else if (isNaN(Number(p.age)) || Number(p.age) < 1 || Number(p.age) > 120)
        e.age = "Enter a valid age (1–120)";
      if (!p.gender) e.gender = "Select a gender";
      if (Object.keys(e).length) errs[i] = e;
    });

    // Validate contact fields (primary passenger only)
    const ce: Record<string, string> = {};
    if (!state.contactPhone.trim() || state.contactPhone.replace(/\D/g, "").length < 10)
      ce.phone = "Enter a valid 10-digit mobile number";
    if (!state.contactEmail.trim() || !state.contactEmail.includes("@"))
      ce.email = "Enter a valid email address";
    if (Object.keys(ce).length) errs["contact"] = ce;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  return (
    <StepCard>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#181d2a", marginBottom: "6px" }}>
        Passenger Details
      </h2>
      <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "24px" }}>
        Add details for all {state.passengers} passenger{state.passengers > 1 ? "s" : ""}.
      </p>

      {/* ── Passenger cards ── */}
      <div className="flex flex-col gap-4">
        {state.passengerDetails.map((p, idx) => (
          <div
            key={p.id}
            style={{
              border: "1.5px solid #e8ebed", borderRadius: "12px",
              padding: "20px", background: "#fafafa",
            }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: "rgba(116,142,254,0.10)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  <User size={15} style={{ color: "#748efe" }} />
                </div>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#181d2a" }}>
                  Passenger {idx + 1}
                  {idx === 0 && (
                    <span style={{ fontSize: "11px", fontWeight: 500, color: "#748efe", marginLeft: "8px" }}>
                      (Primary)
                    </span>
                  )}
                </span>
              </div>

              {idx > 0 && (
                <button
                  onClick={() => removePassenger(idx)}
                  className="flex items-center gap-1 focus:outline-none focus-visible:ring-2 rounded-lg hover:bg-red-50 transition-colors"
                  style={{
                    padding: "4px 10px", fontSize: "12px", color: "#dc2626",
                    border: "1px solid #fecaca", borderRadius: "8px",
                    background: "white", cursor: "pointer",
                  }}
                  aria-label={`Remove passenger ${idx + 1}`}
                >
                  <Trash2 size={12} /> Remove
                </button>
              )}
            </div>

            {/* Name · Age · Gender — 3-column on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FieldLabel required>Full Name</FieldLabel>
                <FieldInput
                  value={p.name}
                  onChange={(v) => updatePassenger(idx, "name", v)}
                  placeholder="As on ticket"
                  error={errors[idx]?.name}
                />
              </div>
              <div>
                <FieldLabel required>Age</FieldLabel>
                <FieldInput
                  type="number"
                  value={p.age}
                  onChange={(v) => updatePassenger(idx, "age", v)}
                  placeholder="e.g. 25"
                  error={errors[idx]?.age}
                />
              </div>
              <div>
                <FieldLabel required>Gender</FieldLabel>
                <FieldSelect
                  value={p.gender}
                  onChange={(v) => updatePassenger(idx, "gender", v)}
                  options={GENDER_OPTIONS}
                  error={errors[idx]?.gender}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add passenger button */}
        {state.passengerDetails.length < state.passengers && (
          <button
            onClick={addPassenger}
            className="flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 transition-colors hover:bg-indigo-50"
            style={{
              border: "2px dashed #748efe", borderRadius: "12px",
              padding: "14px", fontSize: "14px", fontWeight: 600,
              color: "#748efe", background: "rgba(116,142,254,0.03)", cursor: "pointer",
            }}
            aria-label="Add another passenger"
          >
            <UserPlus size={16} />
            Add Passenger
          </button>
        )}
      </div>

      {/* ── Contact Details (primary passenger only) ── */}
      <div
        style={{
          marginTop: "24px", paddingTop: "20px",
          borderTop: "1px solid #f3f4f6",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div
            style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: "rgba(116,142,254,0.10)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            <Phone size={13} style={{ color: "#748efe" }} />
          </div>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#181d2a" }}>
            Contact Details
          </h3>
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>
            — for primary passenger
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mobile number */}
          <div>
            <FieldLabel required>Mobile Number</FieldLabel>
            <FieldInput
              type="tel"
              value={state.contactPhone}
              onChange={(v) => setState({ contactPhone: v })}
              placeholder="10-digit mobile number"
              error={errors["contact"]?.phone}
              icon={<Phone size={15} />}
            />
          </div>

          {/* Email */}
          <div>
            <FieldLabel required>Email Address</FieldLabel>
            <FieldInput
              type="email"
              value={state.contactEmail}
              onChange={(v) => setState({ contactEmail: v })}
              placeholder="ticket@email.com"
              error={errors["contact"]?.email}
              icon={<Mail size={15} />}
            />
          </div>
        </div>

        <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>
          Your e-ticket and booking updates will be sent to these contact details.
        </p>
      </div>

      <NavButtons onBack={onBack} onNext={handleNext} nextLabel="Confirm →" />
    </StepCard>
  );
}
