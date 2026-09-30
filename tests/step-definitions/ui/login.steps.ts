import { Given, Then, When } from "@cucumber/cucumber";
import { AccountRole, ENV } from "../../../config/env";
import { CustomWorld } from "../../../playwright-utils/world";

Given("I am on the CSP Login page", async function (this: CustomWorld) {
  await this.pages.cspLogin.open();
});

When("I enter valid CSP credentials", async function (this: CustomWorld) {
  await this.pages.cspLogin.login();
});

Given("I am on the login page", async function (this: CustomWorld) {
  await this.pages.cpLogin.open();
});

// Credentials come from .env (CP_<ROLE>_USERNAME / CP_<ROLE>_PASSWORD), never from feature files.
When("I sign in to the Customer Portal as the {word} user", async function (this: CustomWorld, role: string) {
  const { username, password } = ENV.account(role as AccountRole);
  await this.pages.cpLogin.login(username, password);
});

Then("I should be logged in successfully", async function (this: CustomWorld) {
  await this.pages.dashboard.verifyLoggedIn();
});

Then("I should see the dashboard page", async function (this: CustomWorld) {
  await this.pages.dashboard.verifyLoggedIn();
});

Then("I should NOT see the dashboard page", async function (this: CustomWorld) {
  await this.pages.dashboard.verifyDashboardNotShown();
});

When("I click on the logout button", async function (this: CustomWorld) {
  await this.pages.dashboard.logout();
});

Then("I should be logged out successfully", async function (this: CustomWorld) {
  await this.pages.dashboard.verifyLoggedOut();
});
