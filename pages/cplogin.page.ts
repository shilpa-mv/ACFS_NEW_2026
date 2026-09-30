import { Page } from "@playwright/test";
import { ENV } from "../config/env";
import { BasePage } from "./base.page";

export class CPLoginPage extends BasePage {
  private readonly usernameInput;
  private readonly passwordInput;
  private readonly continueButton;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.continueButton = page.locator('xpath=//div/child::button[@type="submit"][text()="Continue"]');
  }

  async open(): Promise<void> {
    await this.navigation(ENV.baseUrl);
    await this.usernameInput.waitFor({ state: "visible" });
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.continueButton.click();
    await this.waitForUiIdle(1000, 15_000);
  }
}
