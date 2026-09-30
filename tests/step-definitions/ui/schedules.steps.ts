import { DataTable, Then } from "@cucumber/cucumber";
import { DELIVERY_REQUIRED_FIELDS, DeliveryDetails } from "../../../pages/deliveryschedule.page";
import { CustomWorld } from "../../../playwright-utils/world";
import { parseTable } from "../../../utils/dataTable";

Then("I navigate to the collection scheduling", async function (this: CustomWorld) {
  await this.pages.collectionSchedule.openModule();
});

Then("I should click Port Time Slot Booking", async function (this: CustomWorld) {
  await this.pages.portTimeslot.openBooking();
});

Then("I navigate to the Delivery Schedule Module", async function (this: CustomWorld) {
  await this.pages.deliverySchedule.openModule();
});

Then(
  "select the Port {string} Customer {string} and Consignee {string}",
  async function (this: CustomWorld, port: string, customer: string, consignee: string) {
    await this.pages.deliverySchedule.searchContainers(port, customer, consignee);
  },
);

Then("Select all Containers", async function (this: CustomWorld) {
  await this.pages.deliverySchedule.selectAllAndOpenScheduleDialog();
});

Then("Schedule Delivery with the following Details", async function (this: CustomWorld, table: DataTable) {
  const details = parseTable(table, DELIVERY_REQUIRED_FIELDS) as unknown as DeliveryDetails;
  await this.pages.deliverySchedule.scheduleDelivery(details);
});

Then("Verify the Message {string}", async function (this: CustomWorld, message: string) {
  await this.pages.deliverySchedule.verifyMessage(message);
});

Then("Click Cancel button", async function (this: CustomWorld) {
  await this.pages.deliverySchedule.cancel();
});

Then("Click Schedule Delivery Button", async function (this: CustomWorld) {
  await this.pages.deliverySchedule.reopenScheduleDialog();
});
