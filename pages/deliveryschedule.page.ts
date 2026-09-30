import { expect, Page } from "@playwright/test";
import { resolveRelativeDate, toPickerLabel } from "../utils/dateUtils";
import { BasePage } from "./base.page";

export interface DeliveryDetails {
  DeliveryDate: string;
  TimeFrom: string;
  TimeTo: string;
  CCRequiredTime: string;
  TransportType: string;
  TrailerType: string;
  DockNumber: string;
  Remarks: string;
}

export const DELIVERY_REQUIRED_FIELDS = [
  "DeliveryDate", "TimeFrom", "TimeTo", "CCRequiredTime", "TransportType", "TrailerType", "DockNumber", "Remarks",
] as const;

export class DeliverySchedule extends BasePage {
  private readonly menuButton;
  private readonly portDropdown;
  private readonly customerDropdown;
  private readonly consigneeDropdown;
  private readonly customerSearch;
  private readonly consigneeSearch;
  private readonly selectAllCheckbox;
  private readonly scheduleDeliveryButton;
  private readonly dateDropdown;
  private readonly timeCombobox;
  private readonly hourSpin;
  private readonly timeToLabel;
  private readonly timeToContainer;
  private readonly ccRequiredTimeInput;
  private readonly transportTypeDropdown;
  private readonly trailerTypeDropdown;
  private readonly dockNumberInput;
  private readonly doorDirections;
  private readonly remarks;
  private readonly saveButton;
  private readonly cancelButton;

  constructor(page: Page) {
    super(page);
    this.menuButton = page.locator("#b2-DeliverySchedule");
    this.portDropdown = page.locator("#b4-PortDropdown > div > div");
    this.customerDropdown = page.locator("#b4-CustomerDropdown > div > div");
    this.consigneeDropdown = page.locator("#b4-ConsigneeDropdown > div > div");
    this.customerSearch = page.getByPlaceholder("Search Customer / Customer");
    this.consigneeSearch = page.getByPlaceholder("Search Consignee / Customer");
    this.selectAllCheckbox = page.locator("#b4-CheckboxIsSelectAll");
    this.scheduleDeliveryButton = page.getByRole("button", { name: "Schedule Delivery" });
    this.dateDropdown = page.getByRole("combobox", { name: "Select a date" });
    this.timeCombobox = page.getByRole("combobox", { name: "Time" });
    this.hourSpin = page.getByRole("spinbutton", { name: "Hour" });
    this.timeToLabel = page.getByText("Time To");
    this.timeToContainer = page.locator('xpath=//label[text()="Time To"]/following-sibling::div');
    this.ccRequiredTimeInput = page.locator("//div[@id='b4-b1-CCRequiredTimeBlock']/descendant::input[2]");
    this.transportTypeDropdown = page.getByText("Select Transport Type");
    this.trailerTypeDropdown = page.getByText("Select Trailer Type");
    this.dockNumberInput = page.locator("#b4-b1-Input_DockNumber");
    this.doorDirections = page.locator("#b4-b1-DoorDirectionsDropdown");
    this.remarks = page.locator("#b4-b1-DeliveryBookingForm textarea");
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.cancelButton = page.getByRole("button", { name: "Cancel", exact: true });
  }

  async openModule(): Promise<void> {
    await this.clickAndSettle(this.menuButton);
  }

  async searchContainers(port: string, customer: string, consignee: string): Promise<void> {
    await this.portDropdown.click();
    await this.page.getByRole("option", { name: port }).locator("span").first().click();
    await this.waitForUiIdle();

    await this.customerDropdown.click();
    await this.customerSearch.fill(customer);
    await this.page.getByRole("option", { name: customer }).locator("span").first().click();
    await this.waitForUiIdle();

    await this.consigneeDropdown.click();
    await this.consigneeSearch.fill(consignee);
    await this.page.getByRole("option", { name: consignee }).locator("span").first().click();
    await this.waitForUiIdle(1000, 20_000); // the container list loads after the consignee is chosen
  }

  async selectAllAndOpenScheduleDialog(): Promise<void> {
    await this.selectAllCheckbox.check();
    await this.scheduleDeliveryButton.click();
  }

  async reopenScheduleDialog(): Promise<void> {
    await this.scheduleDeliveryButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async scheduleDelivery(d: DeliveryDetails): Promise<void> {
    await this.dateDropdown.click();
    await this.page.getByLabel(toPickerLabel(resolveRelativeDate(d.DeliveryDate))).click();

    await this.timeCombobox.first().click();
    await this.hourSpin.fill(d.TimeFrom);

    await this.timeToLabel.click();
    await this.waitForUiIdle(300, 3_000);
    await this.timeToContainer.click();
    await this.waitForUiIdle(300, 3_000);
    await this.hourSpin.fill(d.TimeTo);

    await this.timeToLabel.click();
    await this.waitForUiIdle(300, 3_000);
    await this.ccRequiredTimeInput.click();
    await this.hourSpin.fill(d.CCRequiredTime);
    await this.timeToLabel.click();
    await this.waitForUiIdle(300, 3_000);

    await this.transportTypeDropdown.click();
    await this.waitForUiIdle(300, 3_000);
    await this.page.getByRole("option", { name: d.TransportType, exact: true }).click();
    await this.trailerTypeDropdown.click();
    await this.waitForUiIdle(300, 3_000);
    await this.page.getByRole("option", { name: d.TrailerType, exact: true }).click();

    await this.dockNumberInput.fill(d.DockNumber);
    await this.doorDirections.selectOption("0"); // "Front"; DoorPosition in the feature is informational only
    await this.remarks.fill(d.Remarks);

    await this.saveButton.click();
    await this.waitForUiIdle(1000, 10_000);
  }

  async verifyMessage(message: string): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible({ timeout: 20_000 });
  }
}
