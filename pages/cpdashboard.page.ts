import { expect, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class CPDashboard extends BasePage {
  private readonly profileIcon;
  private readonly usernameInput;
  private readonly standardTab;
  private readonly logOutLink;

  constructor(page: Page) {
    super(page);
    this.profileIcon = page.locator("img.img-circle");
    this.usernameInput = page.locator('input[name="username"]');
    this.standardTab = page.getByRole("tab", { name: "Standard" });
    this.logOutLink = page.getByText("Log out");
  }

  async logout(): Promise<void> {
    await this.profileIcon.click();
    await this.logOutLink.click();
  }

  async verifyLoggedOut(): Promise<void> {
    await expect(this.page).toHaveTitle("AUSCFS - Sign In", {timeout: 30_000
  });
  }

  async verifyLoggedIn(): Promise<void> {
    await expect(this.standardTab).toBeVisible({ timeout: 100_000 });
  }

  async verifyDashboardNotShown(): Promise<void> {
    await this.waitForUiIdle(1000, 15_000);
    await expect(this.standardTab).toBeHidden();
  }
}
