import { expect, Page } from "@playwright/test";
import { Logger } from "../utils/logger";
import { BasePage } from "./base.page";

export class ContainersPage extends BasePage {
  private readonly menuItem;
  private readonly firstContainerLink;
  private readonly detailTitle;

  constructor(page: Page) {
    super(page);
    this.menuItem = page.getByRole("menuitem").filter({ hasText: "Containers" });
    // TODO: ask the portal team for a stable id / data-testid. This absolute path is kept as-is
    // because it is the locator that was verified against the portal; it breaks on any layout change.
    this.firstContainerLink = page.locator(
      "body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1) > span:nth-child(1)",
    );
    this.detailTitle = page.locator("div[id='b9-Title'] span");
  }

  async openModule(): Promise<void> {
    await this.clickAndSettle(this.menuItem);
  }

  async openFirstContainer(): Promise<void> {
    await this.firstContainerLink.click();
    await this.waitForUiIdle(1000, 15_000);
  }

  async openContainer(containerNo: string): Promise<void> {
    await this.page.getByRole("link", { name: containerNo }).first().click();
    await this.waitForUiIdle(1000, 15_000);
  }

  async verifyDetailPageOpened(): Promise<void> {
    await expect(this.detailTitle).toBeVisible();
    Logger.info(`Container detail opened: ${(await this.detailTitle.textContent())?.trim()}`);
  }
}
