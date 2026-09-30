import { Then, When } from "@cucumber/cucumber";
import { CustomWorld } from "../../../playwright-utils/world";

When("I click on the Containers", async function (this: CustomWorld)
 { await this.pages.portal.openContainers(); });

When("I click on the Orders", async function (this: CustomWorld) 
{ await this.pages.portal.openOrders(); });

When("I click on the Delivery Schedules", async function (this: CustomWorld) 
{ await this.pages.portal.openDeliverySchedule(); });

When("I click on the Collections Schedules", async function (this: CustomWorld) 
{ await this.pages.portal.openCollectionSchedule(); });

Then("I should see the Containers page", async function (this: CustomWorld) 
{ await this.pages.portal.verifyModuleOpened("Containers"); });

Then("I should see the Orders page", async function (this: CustomWorld) 
{ await this.pages.portal.verifyModuleOpened("Orders"); });

Then("I should see the Delivery Schedules page", async function (this: CustomWorld) 
{ await this.pages.portal.verifyModuleOpened("Delivery Schedule"); });

Then("I should see the Collections Schedules page", async function (this: CustomWorld) 
{ await this.pages.portal.verifyModuleOpened("Collection Schedule"); });
