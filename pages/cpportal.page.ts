import { expect, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export type PortalModule = "Containers" | "Orders" | "Delivery Schedule" | "Collection Schedule";

export class CPPortal extends BasePage {
  private readonly containersButton;
  private readonly ordersButton;
  private readonly deliveriesButton;
  private readonly collectionsButton;

  constructor(page: Page) {
    super(page);
    this.containersButton = page.locator('//a[contains(@href, "Containers")]').getByRole("button");
    this.ordersButton = page.getByRole("menuitem").filter({ hasText: "Orders" }).getByRole("button");
    this.deliveriesButton = page.locator('//a[contains(@href, "DeliverySchedule")]').getByRole("button");
    this.collectionsButton = page.locator('//a[contains(@href, "CollectionSchedule")]').getByRole("button");
  }

  async openContainers(): Promise<void> 
  { await this.clickAndSettle(this.containersButton); }

  async openOrders(): Promise<void> 
  { await this.clickAndSettle(this.ordersButton); }

  async openDeliverySchedule(): Promise<void> 
  { await this.clickAndSettle(this.deliveriesButton); }

  async openCollectionSchedule(): Promise<void> 
  { await this.clickAndSettle(this.collectionsButton); }

  async verifyModuleOpened(moduleName: PortalModule): Promise<void> {
    await expect(this.page.locator("div").filter({ hasText: moduleName }).first()).toBeVisible({ timeout: 50_000 });
    await this.waitForUiIdle();
  }
}
