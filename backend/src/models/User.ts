import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export interface IUser extends Document {
  username: string;
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  aadhaarHash?: string;
  isEmailVerified: boolean;
  isAadhaarVerified: boolean;
  role: "user" | "admin";
  deviceFingerprints: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    aadhaarHash: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isAadhaarVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    deviceFingerprints: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// ── Hash password before saving ──────────────────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// ── Instance method: compare passwords ───────────────────────────────────────
userSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password as string);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
