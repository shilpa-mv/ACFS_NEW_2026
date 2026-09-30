import { expect, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class ExceptionsPage extends BasePage {
  private readonly exceptionsHeading;

  constructor(page: Page) {
    super(page);
    this.exceptionsHeading = page.getByText("Exceptions").first();
  }

  async verifyExceptionsShownOnContainerDetail(exceptionText?: string): Promise<void> {
    await expect(this.exceptionsHeading).toBeVisible();
    if (exceptionText) await expect(this.page.getByText(exceptionText)).toBeVisible();
  }
}
