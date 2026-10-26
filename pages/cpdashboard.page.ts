import { expect, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class CPDashboard extends BasePage {
  private readonly profileIcon;
  private readonly usernameInput;
  private readonly standardTab;
  private readonly logOutLink;
  private urlBeforeLogout = "";

  constructor(page: Page) {
    super(page);
    this.profileIcon = page.locator("img.img-circle");
    this.usernameInput = page.locator('input[name="username"]');
    this.standardTab = page.getByRole("tab", { name: "Standard" });
    this.logOutLink = page.locator("#b3-Logout");
  }

  async logout(): Promise<void> {
    this.urlBeforeLogout = this.page.url();
  await this.waitForUiIdle(1000, 10_000);        // let the previous screen finish loading

  // If the menu closes while we click, open it again and retry
  await expect(async () => {
    if (!(await this.logOutLink.isVisible())) {
      await this.profileIcon.click();
    }
    await this.logOutLink.click({ timeout: 3_000 });
  }).toPass({ timeout: 30_000, intervals: [500, 1_000, 2_000] });
}

  async verifyLoggedOut(): Promise<void> {
     await this.page.waitForLoadState("domcontentloaded");
  await this.waitForUiIdle(1000, 10_000);

  // A sign-in form (Okta / Auth0) or a Log in button is showing...
  const signIn = this.page
    .locator('input[name="identifier"], input[name="username"]')
    .or(this.page.getByRole("link", { name: /log ?in/i }))
    .or(this.page.getByRole("button", { name: /log ?in/i }))
    .first();
  await expect(signIn).toBeVisible({ timeout: 30_000 });

  await expect(this.profileIcon).toBeHidden();
  }

  async verifyLoggedIn(): Promise<void> {
    await expect(this.standardTab).toBeVisible({ timeout: 100_000 });
  }

  async verifyDashboardNotShown(): Promise<void> {
    await this.waitForUiIdle(1000, 15_000);
    await expect(this.standardTab).toBeHidden();
  }
}
