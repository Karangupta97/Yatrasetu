import mongoose, { Document, Model, Schema, Types } from "mongoose";

// ── Sub-document interfaces ───────────────────────────────────────────────────

export interface IScanLogEntry {
  scannedAt: Date;
  scannedBy: string; // TTE ID
  scanType: "VERIFICATION" | "ENTRY" | "EXIT";
}

export interface IPassengerCount {
  adults: number;   // min 1
  children: number; // default 0
}

// ── Main document interface ───────────────────────────────────────────────────

export interface ILocalTicket extends Document {
  ticketId: string;                  // UUID, unique
  utsNumber: string;                 // X0 + 8 uppercase alphanumeric
  userId: Types.ObjectId;            // ref User
  passengerCount: IPassengerCount;
  fromStation: string;
  toStation: string;
  viaStation?: string;
  distanceKm: number;
  ticketType: "ONE_WAY" | "RETURN";
  class: "SECOND" | "FIRST";
  fare: number;
  purchasedAt: Date;
  journeyCommencedAt: Date | null;
  journeyCompletedAt: Date | null;
  status: "ACTIVE" | "USED" | "EXPIRED" | "CANCELLED";
  scanLog: IScanLogEntry[];
  createdAt: Date;
  updatedAt: Date;
}

// ── Sub-document schemas ──────────────────────────────────────────────────────

export const scanLogSchema = new Schema<IScanLogEntry>(
  {
    scannedAt: { type: Date,   required: true },
    scannedBy: { type: String, required: true },
    scanType:  { type: String, enum: ["VERIFICATION", "ENTRY", "EXIT"], required: true },
  },
  { _id: false }
);

// ── Main schema ───────────────────────────────────────────────────────────────

const localTicketSchema = new Schema<ILocalTicket>(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    utsNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^X0[A-Z0-9]{8}$/,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    passengerCount: {
      adults:   { type: Number, required: true, min: 1 },
      children: { type: Number, default: 0 },
    },
    fromStation: { type: String, required: true },
    toStation:   { type: String, required: true },
    viaStation:  { type: String },
    distanceKm:  { type: Number, required: true },
    ticketType: {
      type: String,
      enum: ["ONE_WAY", "RETURN"],
      required: true,
    },
    class: {
      type: String,
      enum: ["SECOND", "FIRST"],
      required: true,
    },
    fare:        { type: Number, required: true },
    purchasedAt: { type: Date,   default: Date.now },
    journeyCommencedAt: { type: Date, default: null },
    journeyCompletedAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["ACTIVE", "USED", "EXPIRED", "CANCELLED"],
      default: "ACTIVE",
    },
    scanLog: { type: [scanLogSchema], default: [] },
  },
  { timestamps: true }
);

// ── Unique indexes (declared explicitly for clarity) ─────────────────────────
localTicketSchema.index({ ticketId: 1 },  { unique: true });
localTicketSchema.index({ utsNumber: 1 }, { unique: true });

// ── Model ─────────────────────────────────────────────────────────────────────

const LocalTicket: Model<ILocalTicket> = mongoose.model<ILocalTicket>(
  "LocalTicket",
  localTicketSchema
);

export default LocalTicket;
