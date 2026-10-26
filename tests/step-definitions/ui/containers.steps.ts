import { Then } from "@cucumber/cucumber";
import { CustomWorld } from "../../../playwright-utils/world";

Then("I navigate to the Containers Module", async function (this: CustomWorld) {
  await this.pages.containers.openModule();
});

Then("I Click on Container number", async function (this: CustomWorld) {
  await this.pages.containers.openFirstContainer();
  await this.pages.containers.verifyDetailPageOpened();
});

Then("I should see the exception in the container detail page", async function (this: CustomWorld) {
  await this.pages.exceptions.verifyExceptionsShownOnContainerDetail();
});
