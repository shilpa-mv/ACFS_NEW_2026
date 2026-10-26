import * as OTPAuth from "otpauth";

const PERIOD_SECONDS = 30;

/**
 * Generate a TOTP code. If the current code is about to expire, wait for the next
 * window first so the code is still valid when the portal checks it.
 */
export async function generateOTP(secret: string, minRemainingSeconds = 3): Promise<string> {
  const totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(secret.replace(/\s+/g, "")),
    algorithm: "SHA1",
    digits: 6,
    period: PERIOD_SECONDS,
  });

  const remaining = PERIOD_SECONDS - (Math.floor(Date.now() / 1000) % PERIOD_SECONDS);
  if (remaining < minRemainingSeconds) {
    await new Promise((resolve) => setTimeout(resolve, (remaining + 1) * 1000));
  }
  return totp.generate();
}
