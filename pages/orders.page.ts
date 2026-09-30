import { expect, Page } from "@playwright/test";
import { ENV } from "../config/env";
import { Logger } from "../utils/logger";
import { BasePage } from "./base.page";

export interface OrderDetails {
  Port: string;
  Customer: string;
  Consignee: string;
  CustomerReferenceNumber: string;
  OceanBillNumber: string;
  VesselSchedule: string;
  ContainerNo: string;
  TypeSize: string;
  CargoType: string;
  SealNo: string;
  GrossWeight: string;
  Temperature: string;
  IMOCode: string;
  UNCode: string;
  DoorDirection: string;
}

export const ORDER_REQUIRED_FIELDS = [
  "Port", "Customer", "Consignee", "CustomerReferenceNumber", "OceanBillNumber", "VesselSchedule",
  "ContainerNo", "TypeSize", "CargoType", "SealNo", "GrossWeight", "Temperature", "IMOCode", "UNCode", "DoorDirection",
] as const;

/** Value of the "Door Direction" <select> for each name used in feature files. */
const DOOR_DIRECTION_VALUE: Record<string, string> = { front: "0" };

export class OrdersPage extends BasePage {
  private readonly menuItem;
  private readonly createOrderButton;
  private readonly confirmButton;
  private readonly successMessage;

  constructor(page: Page) {
    super(page);
    this.menuItem = page.getByRole("menuitem").filter({ hasText: "Orders" });
    this.createOrderButton = page.getByRole("button", { name: "Create Order" });
    this.confirmButton = page.getByRole("button", { name: "Confirm" });
    this.successMessage = page.getByText("Order created successfully");
  }

  async openModule(): Promise<void> {
    await this.clickAndSettle(this.menuItem);
  }

  async createOrder(order: OrderDetails): Promise<void> {
    const p = this.page;
    Logger.info(`Creating order: container ${order.ContainerNo}, CRN ${order.CustomerReferenceNumber}`);

    await this.createOrderButton.click();
    await p.getByLabel("Select Port").selectOption(order.Port);
    await this.waitForUiIdle();

    await this.selectCustomer(order.Customer);
    await this.selectConsignee(order.Consignee);

    await p.getByRole("textbox", { name: "Customer Reference Number*" }).fill(order.CustomerReferenceNumber);
    await p.getByRole("textbox", { name: "Ocean Bill Number*" }).fill(order.OceanBillNumber);

    await p.getByRole("region", { name: "Vessel Details" }).getByLabel("Select an option").click();
    await p.getByRole("option", { name: order.VesselSchedule }).click();

    await p.getByRole("textbox", { name: "Container No*" }).fill(order.ContainerNo);
    await p.getByLabel("Type Size").selectOption(order.TypeSize);
    await p.getByLabel("Cargo Type").selectOption(order.CargoType);
    await p.getByRole("textbox", { name: "Seal No*" }).fill(order.SealNo);
    await p.getByRole("spinbutton", { name: "Gross Weight (kg)*" }).fill(order.GrossWeight);
    await p.getByRole("textbox", { name: "Temperature (°C)" }).fill(order.Temperature);
    await p.getByRole("textbox", { name: "IMO Code*" }).fill(order.IMOCode);
    await p.getByRole("textbox", { name: "UN Code*" }).fill(order.UNCode);

    const doorValue = DOOR_DIRECTION_VALUE[order.DoorDirection.toLowerCase()];
    if (doorValue === undefined) {
      throw new Error(`Unknown DoorDirection "${order.DoorDirection}". Known: ${Object.keys(DOOR_DIRECTION_VALUE).join(", ")}`);
    }
    await p.getByLabel("Door Direction").selectOption(doorValue);

    await this.createOrderButton.click();
    await this.confirmButton.click();
  }

  private async selectCustomer(customer: string): Promise<void> {
    const p = this.page;
    // The customer picker is a custom (virtual-select) control that needs several interactions to open.
    await p.getByText("Customer", { exact: true }).click();
    await p.getByRole("combobox", { name: "Select an option" }).locator("div").first().click();
    await p.getByText("Select Customer").click();
    await p.locator('xpath=//div[text()="Select Customer"]/parent::div[1]').click({ force: true });
    const search = p.getByPlaceholder("Search Customer / Customer Code");
    await search.fill(customer);
    await p.getByText(customer).first().click();
    await this.waitForUiIdle();
  }

  private async selectConsignee(consignee: string): Promise<void> {
    await this.page.locator("#b8-b2-CustomerConsignee").getByRole("button", { name: "Select an option" }).click();
    await this.page.getByRole("option", { name: consignee }).click();
  }

  async verifyOrderCreated(): Promise<void> {
    await expect(this.successMessage).toBeVisible();
    // The order reaches the Containers list asynchronously; give the back end a moment before the next module.
    await this.page.waitForTimeout(ENV.orderPropagationWaitMs);
  }
}
