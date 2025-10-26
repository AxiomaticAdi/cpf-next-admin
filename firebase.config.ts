import "server-only";
import admin from "firebase-admin";

function loadServiceAccount() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error(
      "Missing env var GOOGLE_SERVICE_ACCOUNT_JSON. Add it to .env or your deploy env.",
    );
  }

  // If the secret was stored base64-encoded, decode then parse; otherwise parse directly.
  const maybeDecoded = /^[A-Za-z0-9+/=]+$/.test(raw)
    ? Buffer.from(raw, "base64").toString("utf8")
    : raw;

  let sa: Record<string, unknown>;
  try {
    sa = JSON.parse(maybeDecoded);
  } catch (error) {
    throw new Error(
      `GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON (after optional base64 decode). Error: ${error}`,
    );
  }

  // Normalize private key line breaks if it contains literal "\n"
  if (sa.private_key && typeof sa.private_key === "string") {
    sa.private_key = sa.private_key.replace(/\\n/g, "\n");
  }

  return sa;
}

if (!admin.apps.length) {
  const serviceAccount = loadServiceAccount();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const db = admin.firestore();
export default db;
