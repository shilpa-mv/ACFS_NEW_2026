import { DataTable, Then } from "@cucumber/cucumber";
import { ORDER_REQUIRED_FIELDS, OrderDetails } from "../../../pages/orders.page";
import { CustomWorld } from "../../../playwright-utils/world";
import { parseTable } from "../../../utils/dataTable";

Then("I navigate to the Orders Module", async function (this: CustomWorld) {
  await this.pages.orders.openModule();
});

Then("Create an Order with the below details", async function (this: CustomWorld, table: DataTable) {
  const order = parseTable(table, ORDER_REQUIRED_FIELDS) as unknown as OrderDetails;
  await this.pages.orders.createOrder(order);
});

Then(
  "I should see a confirmation message indicating that the order has been created successfully",
  async function (this: CustomWorld) {
    await this.pages.orders.verifyOrderCreated();
  },
);
