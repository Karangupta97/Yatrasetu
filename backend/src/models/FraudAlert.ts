import mongoose, { Document, Model, Schema } from "mongoose";

// ── Main document interface ───────────────────────────────────────────────────

export interface IFraudAlert extends Document {
  ticketId: string;
  ticketModel: "local" | "express";
  scannedAt: Date;
  tteId: string;
  previousScanAt: Date;
  previousTteId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ── Schema ────────────────────────────────────────────────────────────────────

const fraudAlertSchema = new Schema<IFraudAlert>(
  {
    ticketId: {
      type: String,
      required: [true, "Ticket ID is required"],
    },
    ticketModel: {
      type: String,
      enum: ["local", "express"],
      required: [true, "Ticket model is required"],
    },
    scannedAt: {
      type: Date,
      required: [true, "Scan timestamp is required"],
    },
    tteId: {
      type: String,
      required: [true, "TTE ID is required"],
    },
    previousScanAt: {
      type: Date,
      required: [true, "Previous scan timestamp is required"],
    },
    previousTteId: {
      type: String,
      required: [true, "Previous TTE ID is required"],
    },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
fraudAlertSchema.index({ ticketId: 1 });
fraudAlertSchema.index({ tteId: 1 });

// ── Model ─────────────────────────────────────────────────────────────────────

const FraudAlert: Model<IFraudAlert> = mongoose.model<IFraudAlert>(
  "FraudAlert",
  fraudAlertSchema
);

export default FraudAlert;
