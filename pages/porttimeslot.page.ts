import { Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class PorttimeslotPage extends BasePage {
  private readonly menuItem;

  constructor(page: Page) {
    super(page);
    this.menuItem = page.getByRole("menuitem").filter({ hasText: "Port Timeslot" });
  }

  async openBooking(): Promise<void> {
    await this.clickAndSettle(this.menuItem);
  }
}
