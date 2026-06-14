import axios from "axios";

const SANDBOX_BASE = "https://api.sandbox.co.in";

/**
 * Fetches a fresh JWT from sandbox.co.in.
 *
 * Authentication is header-based — x-api-key + x-api-secret.
 * There is NO client_id/client_secret body — that pattern is outdated.
 *
 * The access token is valid for 24 hours.
 * Per the integration spec, call this fresh before every OKYC request.
 *
 * Required env vars:
 *   SANDBOX_API_KEY    — key_live_... or key_test_...
 *   SANDBOX_API_SECRET — secret_live_... or secret_test_...
 */
export async function getSandboxToken(): Promise<string> {
  const apiKey = process.env.SANDBOX_API_KEY;
  const apiSecret = process.env.SANDBOX_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error(
      "SANDBOX_API_KEY and SANDBOX_API_SECRET must be set in environment variables."
    );
  }

  const response = await axios.post(
    `${SANDBOX_BASE}/authenticate`,
    {},
    {
      headers: {
        "x-api-key": apiKey,
        "x-api-secret": apiSecret,
        "x-api-version": "2.0",
        "Content-Type": "application/json",
      },
    }
  );

  // Response: { code, data: { access_token }, timestamp, transaction_id }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const token =
    (response.data?.data?.access_token as string | undefined) ??
    (response.data?.access_token as string | undefined);

  if (!token) {
    throw new Error(
      `Sandbox authenticate did not return access_token. Body: ${JSON.stringify(response.data)}`
    );
  }

  return token;
}
