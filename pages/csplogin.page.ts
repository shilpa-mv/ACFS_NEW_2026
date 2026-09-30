import { Page } from "@playwright/test";
import { ENV } from "../config/env";
import { generateOTP } from "../utils/otputils";
import { Logger } from "../utils/logger";
import { BasePage } from "./base.page";

export class CSPLoginPage extends BasePage {
  private readonly usernameInput;
  private readonly nextButton;
  private readonly passcodeInput;
  private readonly verifyInput;
  private readonly authenticatorLink;
  private readonly verifyButton;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="identifier"]');
    this.nextButton = page.locator('//input[@value="Next"]');
    this.passcodeInput = page.locator('input[name="credentials.passcode"]');
    this.verifyInput = page.locator('//input[@value="Verify"]');
    this.authenticatorLink = page.getByRole("link", { name: "Select Google Authenticator." });
    this.verifyButton = page.getByRole("button", { name: "Verify" });
  }

  async open(): Promise<void> {
    await this.navigation(ENV.cspUrl);
    await this.usernameInput.waitFor({ state: "visible" });
  }

  async login(): Promise<void> {
    
    await this.usernameInput.fill(ENV.cspUsername);
    await this.nextButton.click();

    await this.passcodeInput.fill(ENV.cspPassword);
    await this.verifyInput.click();

    await this.authenticatorLink.click();
    await this.passcodeInput.waitFor({ state: "visible" });

    const otp = await generateOTP(ENV.totpSecret); // the code itself is never logged
    Logger.info("Submitting one-time passcode");
    await this.passcodeInput.fill(otp);
    await this.verifyButton.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.waitForUiIdle(1000, 15_000);
  }
}
