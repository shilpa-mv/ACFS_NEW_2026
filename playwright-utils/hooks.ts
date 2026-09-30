import { After, AfterAll, Before, BeforeAll, BeforeStep, Status, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { ENV, PATHS } from "../config/env";
import { Logger } from "../utils/logger";
import { BrowserManager } from "./browserManager";
import { NetworkTracker, trackers } from "./networkTracker";
import { PageManager } from "./pageManager";
import { StepOverlay } from "./stepOverlay";
import { CustomWorld } from "./world";

setDefaultTimeout(ENV.stepTimeoutMs);
expect.configure({ timeout: ENV.expectTimeoutMs });

const isUiScenario = (tags: readonly { name: string }[]): boolean => !tags.some((t) => t.name === "@API");
const slug = (text: string): string =>
  `${text.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "").slice(0, 80)}_${Date.now().toString(36)}`;

BeforeAll(async function () {
  for (const dir of [PATHS.videos, PATHS.traces, PATHS.screenshots, PATHS.allure]) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(PATHS.allure, "environment.properties"),
    [`Browser=${ENV.browser}`, `Headless=${ENV.headless}`, `Node=${process.version}`, `CI=${ENV.isCI}`].join("\n"),
  );
});

Before(async function (this: CustomWorld, { pickle }) {
  if (!isUiScenario(pickle.tags)) return; // API scenarios do not need a browser

  this.context = await BrowserManager.newContext();
  this.context.setDefaultTimeout(ENV.actionTimeoutMs);
  if (ENV.trace !== "off") {
    await this.context.tracing.start({ screenshots: true, snapshots: true, sources: false });
  }

  this.page = await this.context.newPage();
  trackers.set(this.page, new NetworkTracker(this.page));
  this.pages = new PageManager(this.page);
  this.page.on("pageerror", (error) => this.consoleErrors.push(`pageerror: ${error.message}`));
  this.page.on("console", (msg) => {
    if (msg.type() === "error") this.consoleErrors.push(`console.error: ${msg.text()}`);
  });
  if (ENV.stepOverlay) this.overlay = new StepOverlay(this.page);
});

BeforeStep(async function (this: CustomWorld, { pickleStep }) {
  await this.overlay?.show(pickleStep.text);
});

After(async function (this: CustomWorld, { result, pickle }) {
  const failed = result?.status === Status.FAILED;
  const name = slug(pickle.name);

  // API scenarios
  await this.apiContext?.dispose();

  if (!this.context) return;
  const video = this.page.video();

  try {
    if (failed) {
      if (ENV.screenshotOnFailure) {
        const shot = await this.page.screenshot({ fullPage: true }).catch(() => undefined);
        if (shot) {
          fs.writeFileSync(path.join(PATHS.screenshots, `${name}.png`), shot);
          this.attach(shot, "image/png");
        }
      }
      this.attach(`URL: ${this.page.url()}`, "text/plain");
      if (this.consoleErrors.length) this.attach(this.consoleErrors.join("\n"), "text/plain");
    }

    if (ENV.trace !== "off") {
      const keep = ENV.trace === "on" || failed;
      const tracePath = path.join(PATHS.traces, `${name}.zip`);
      await this.context.tracing.stop(keep ? { path: tracePath } : undefined);
      if (keep && fs.existsSync(tracePath)) {
        this.attach(fs.readFileSync(tracePath), "application/zip");
        Logger.info(`Trace saved: ${tracePath}  (npx playwright show-trace "${tracePath}")`);
      }
    }
  } finally {
    await this.context.close(); // finalises the video file
  }

  if (video) {
    const keep = ENV.video === "on" || failed;
    if (keep) {
      const target = path.join(PATHS.videos, `${name}.webm`);
      await video.saveAs(target).catch(() => undefined);
      if (fs.existsSync(target)) this.attach(fs.readFileSync(target), "video/webm");
    }
    await video.delete().catch(() => undefined);
  }
});

AfterAll(async function () {
  await BrowserManager.close();
});
