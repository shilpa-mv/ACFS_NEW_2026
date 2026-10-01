import { expect, Page } from "@playwright/test";
import path from "path";
import { PATHS } from "../config/env";
import { Logger } from "../utils/logger";
import { BasePage } from "./base.page";

export class PreAlertsPage extends BasePage {
  private readonly menuItem;
  private readonly uploadButton;
  private readonly chooseFileButton;
  private readonly commentsBox;
  private readonly uploadFileButton;
  private readonly successMessage;
  private readonly firstRowComments;
  private readonly firstRowCreateOrderCell;
  private readonly pdfFrame;

  constructor(page: Page) {
    super(page);
    this.menuItem = page
  .getByRole("menuitem").filter({ hasText: /pre[\s-]?alerts?/i })
  .or(page.getByRole("link", { name: /pre[\s-]?alerts?/i }))
  .first();
    this.uploadButton = page.getByRole("button", { name: "Upload Pre-Alert" });
    this.chooseFileButton = page.getByRole("button", { name: "Choose File" });
    this.commentsBox = page.getByRole("textbox");
    this.uploadFileButton = page.getByRole("button", { name: "Upload File" });
    this.successMessage = page.getByText("Pre-alert successfully uploaded");
    this.firstRowComments = page.locator("//table[@id='b4-PreAlertTable']/descendant::tr[2]/td[6]");
    this.firstRowCreateOrderCell = page.locator("tr.table-row").locator("td").nth(6);
    this.pdfFrame = page.frameLocator("#b9-pdf_iframe");
  }

  async openModule(): Promise<void> 
  { await expect(this.menuItem, "Pre-Alert menu not found: wrong user, page or collapsed layout?")
    .toBeVisible({ timeout: 20_000 });
  await this.clickAndSettle(this.menuItem); }

  async clickUpload(): Promise<void> 
  { await this.clickAndSettle(this.uploadButton); }

  async uploadDocument(comments: string, fileName = "ZIM_EDO_VERSION_1-2.PDF"): Promise<void> {
    await this.chooseFileButton.setInputFiles(path.join(PATHS.testFiles, fileName));
    await this.commentsBox.fill(comments);
    await this.uploadFileButton.click();
  }

  async verifyUploaded(comments: string): Promise<void> {
    await expect(this.successMessage).toBeVisible();
    await expect(this.firstRowComments).toContainText(comments);
  }

  async verifyNewestRecordListed(): Promise<void> {
    await expect(this.firstRowComments).toBeVisible();
  }

  async openCreateOrderForNewestRecord(): Promise<void> {
    await this.waitForUiIdle(1000, 15_000);
    await this.firstRowCreateOrderCell.click();
    await this.waitForUiIdle(1000, 15_000);
  }

  async verifyPdfShownBesideOrderForm(): Promise<void> {
    await expect(this.page.locator("#b9-pdf_iframe")).toBeVisible();
    await expect(this.pdfFrame.locator(".pdfViewer")).toBeVisible();
    await expect(this.pdfFrame.getByText("Import Delivery Order", { exact: false })).toBeVisible();
    Logger.info("Pre-alert PDF is displayed next to the order form");
  }
}
