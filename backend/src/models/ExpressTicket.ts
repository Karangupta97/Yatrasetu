import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IScanLogEntry, scanLogSchema } from "./LocalTicket.js";

// ── Sub-document interfaces ───────────────────────────────────────────────────

export interface IExpressPassenger {
  name: string;
  age: number;
  gender: "M" | "F" | "T";
  seat: string;
  coach: string;
  berthType: string;
  status: "CNF" | "WL" | "RAC" | "GNWL";
}

// ── Main document interface ───────────────────────────────────────────────────

export interface IExpressTicket extends Document {
  ticketId: string;
  pnrNumber: string;           // unique 10-digit numeric string
  userId: Types.ObjectId;      // ref User
  trainNo: string;
  trainName: string;
  fromStation: string;
  toStation: string;
  journeyDate: Date;
  departureTime: string;       // HH:MM
  arrivalTime: string;
  distanceKm: number;
  ticketSubType: "RESERVED_ONE_WAY" | "RESERVED_RETURN" | "UNRESERVED_ONE_WAY";
  class: "SL" | "3A" | "2A" | "1A" | "CC" | "2S" | "GEN";
  quota: string;               // default "GN"
  passengers: IExpressPassenger[];
  fare: number;
  totalFare: number;
  purchasedAt: Date;
  returnJourneyDate: Date | null;
  returnTrainNo: string | null;
  ticketStatus: "ACTIVE" | "USED" | "EXPIRED" | "CANCELLED";
  scanLog: IScanLogEntry[];
  createdAt: Date;
  updatedAt: Date;
}

// ── Sub-document schemas ──────────────────────────────────────────────────────

const passengerSchema = new Schema<IExpressPassenger>(
  {
    name:      { type: String, required: true },
    age:       { type: Number, required: true },
    gender:    { type: String, enum: ["M", "F", "T"], required: true },
    seat:      { type: String, required: true },
    coach:     { type: String, required: true },
    berthType: { type: String, required: true },
    status:    { type: String, enum: ["CNF", "WL", "RAC", "GNWL"], required: true },
  },
  { _id: false }
);

// ── Main schema ───────────────────────────────────────────────────────────────

const expressTicketSchema = new Schema<IExpressTicket>(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    pnrNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^\d{10}$/,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trainNo:     { type: String, required: true },
    trainName:   { type: String, required: true },
    fromStation: { type: String, required: true },
    toStation:   { type: String, required: true },
    journeyDate: { type: Date,   required: true },
    departureTime: {
      type: String,
      required: true,
      match: /^\d{2}:\d{2}$/,
    },
    arrivalTime: { type: String, required: true },
    distanceKm:  { type: Number, required: true },
    ticketSubType: {
      type: String,
      enum: ["RESERVED_ONE_WAY", "RESERVED_RETURN", "UNRESERVED_ONE_WAY"],
      required: true,
    },
    class: {
      type: String,
      enum: ["SL", "3A", "2A", "1A", "CC", "2S", "GEN"],
      required: true,
    },
    quota:      { type: String, default: "GN" },
    passengers: { type: [passengerSchema], required: true },
    fare:       { type: Number, required: true },
    totalFare:  { type: Number, required: true },
    purchasedAt: { type: Date, default: Date.now },
    returnJourneyDate: { type: Date,   default: null },
    returnTrainNo:     { type: String, default: null },
    ticketStatus: {
      type: String,
      enum: ["ACTIVE", "USED", "EXPIRED", "CANCELLED"],
      default: "ACTIVE",
    },
    scanLog: { type: [scanLogSchema], default: [] },
  },
  { timestamps: true }
);

// ── Unique indexes (declared explicitly for clarity) ─────────────────────────
expressTicketSchema.index({ ticketId: 1 },  { unique: true });
expressTicketSchema.index({ pnrNumber: 1 }, { unique: true });

// ── Model ─────────────────────────────────────────────────────────────────────

const ExpressTicket: Model<IExpressTicket> = mongoose.model<IExpressTicket>(
  "ExpressTicket",
  expressTicketSchema
);

export default ExpressTicket;
