import { Then, When } from "@cucumber/cucumber";
import { CustomWorld } from "../../../playwright-utils/world";

Then("I navigate to the PreAlerts Module", async function (this: CustomWorld) {
  await this.pages.preAlerts.openModule();
});

When("clicks Upload Pre-Alert", async function (this: CustomWorld) {
  await this.pages.preAlerts.clickUpload();
});

Then("uploads a PDF file with comments {string}", async function (this: CustomWorld, comments: string) {
  await this.pages.preAlerts.uploadDocument(this.resolve(comments));
});

Then(
  "the file should be uploaded successfully and comments {string} visible",
  async function (this: CustomWorld, comments: string) {
    await this.pages.preAlerts.verifyUploaded(this.resolve(comments));
  },
);

// The previous version of this step was empty, so the scenario passed without checking anything.
Then("a new record should appear in the Pre Alert List screen", async function (this: CustomWorld) {
  await this.pages.preAlerts.verifyNewestRecordListed();
});

When("click on Create Order from the new Pre Alert record", async function (this: CustomWorld) {
  await this.pages.preAlerts.openCreateOrderForNewestRecord();
});

Then(
  "User has the provison to create order with PDF document visible on right side",
  async function (this: CustomWorld) {
    await this.pages.preAlerts.verifyPdfShownBesideOrderForm();
  },
);
