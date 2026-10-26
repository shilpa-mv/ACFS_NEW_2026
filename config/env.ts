import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env"), quiet: true });

export type CaptureMode = "off" | "on" | "retain-on-failure";
export type AccountRole = "customer" | "prealert";

const isTrue = (value: string | undefined, fallback: boolean): boolean =>
  value === undefined || value.trim() === ""
    ? fallback
    : ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());

const toInt = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return value !== undefined && value.trim() !== "" && Number.isFinite(parsed) ? parsed : fallback;
};

const toMode = (value: string | undefined, fallback: CaptureMode): CaptureMode => {
  const v = (value ?? "").trim().toLowerCase();
  return v === "off" || v === "on" || v === "retain-on-failure" ? v : fallback;
};

/** Read a mandatory variable lazily, so only the tests that need it fail when it is missing. */
function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing environment variable "${name}". Copy .env.example to .env and fill it in.`);
  }
  return value;
}

const isCI = isTrue(process.env.CI, false);

export const ENV = {
  // ---- application under test (required only when a scenario uses them) ----
  get baseUrl(): string { return required("BASE_URL"); },
  get cspUrl(): string { return required("CSP_URL"); },
  get cspUsername(): string { return required("CSP_USERNAME"); },
  get cspPassword(): string { return required("CSP_PASSWORD"); },
  get totpSecret(): string { return required("TOTP_SECRET"); },
  get userApiUrl(): string { return required("USER_API_URL"); },

  /** Customer Portal accounts, e.g. CP_CUSTOMER_USERNAME / CP_CUSTOMER_PASSWORD. */
  account(role: AccountRole): { username: string; password: string } {
    const prefix = `CP_${role.toUpperCase()}`;
    return { username: required(`${prefix}_USERNAME`), password: required(`${prefix}_PASSWORD`) };
  },

  // ---- runtime behaviour ----
  browser: (process.env.BROWSER ?? "chromium").trim().toLowerCase(),
  headless: isTrue(process.env.HEADLESS, isCI), // headed locally, headless on CI
  slowMo: toInt(process.env.SLOW_MO, 0),
  viewport: { width: toInt(process.env.VIEWPORT_WIDTH, 1920), height: toInt(process.env.VIEWPORT_HEIGHT, 1080) },
  stepTimeoutMs: toInt(process.env.STEP_TIMEOUT_MS, 120_000),
  actionTimeoutMs: toInt(process.env.ACTION_TIMEOUT_MS, 30_000),
  expectTimeoutMs: toInt(process.env.EXPECT_TIMEOUT_MS, 20_000),

  // ---- evidence ----
  video: toMode(process.env.VIDEO, "retain-on-failure"),
  trace: toMode(process.env.TRACE, "retain-on-failure"),
  screenshotOnFailure: isTrue(process.env.SCREENSHOT_ON_FAILURE, true),
  stepOverlay: isTrue(process.env.STEP_OVERLAY, false), // caption of the current Gherkin step inside the video

  /** The portal publishes a new order to the Containers list asynchronously. */
  orderPropagationWaitMs: toInt(process.env.ORDER_PROPAGATION_WAIT_MS, 20_000),
  isCI,
};

export const PATHS = {
  results: path.resolve(__dirname, "../test-results"),
  videos: path.resolve(__dirname, "../test-results/videos"),
  traces: path.resolve(__dirname, "../test-results/traces"),
  screenshots: path.resolve(__dirname, "../test-results/screenshots"),
  allure: path.resolve(__dirname, "../allure-results"),
  testFiles: path.resolve(__dirname, "../test-data/files"),
};
