import { Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class CollectionschedulePage extends BasePage {
  private readonly menuItem;

  constructor(page: Page) {
    super(page);
    this.menuItem = page.getByRole("menuitem").filter({ hasText: "Collection Schedule" });
  }

  async openModule(): Promise<void> {
    await this.clickAndSettle(this.menuItem);
  }
}
