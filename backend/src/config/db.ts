import mongoose from "mongoose";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

let retryCount = 0;

/**
 * Connects to MongoDB Atlas with exponential-backoff retry logic.
 * Throws after MAX_RETRIES failed attempts so the process can exit cleanly.
 */
export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined in environment variables. " +
        "Add it to your .env file and never hardcode credentials."
    );
  }

  mongoose.set("strictQuery", true); // Reject fields not in schema

  mongoose.connection.on("connected", () => {
    console.log("✅  MongoDB connected");
    retryCount = 0; // Reset on successful connection
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌  MongoDB connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️   MongoDB disconnected");
  });

  await attemptConnection(uri);
}

async function attemptConnection(uri: string): Promise<void> {
  try {
    await mongoose.connect(uri, {
      // Keep connections alive and time out dead ones quickly
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // Connection pool – tune per load requirements
      maxPoolSize: 10,
      minPoolSize: 2,
    });
  } catch (err) {
    retryCount += 1;

    if (retryCount >= MAX_RETRIES) {
      console.error(
        `❌  MongoDB failed to connect after ${MAX_RETRIES} attempts. Exiting.`
      );
      process.exit(1);
    }

    const delay = RETRY_DELAY_MS * retryCount;
    console.warn(
      `⟳  MongoDB connection attempt ${retryCount}/${MAX_RETRIES} failed. ` +
        `Retrying in ${delay / 1000}s…`
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
    await attemptConnection(uri);
  }
}

/**
 * Gracefully closes the MongoDB connection.
 * Call this inside SIGTERM / SIGINT handlers.
 */
export async function disconnectDB(): Promise<void> {
  await mongoose.connection.close();
  console.log("🔌  MongoDB connection closed gracefully");
}
