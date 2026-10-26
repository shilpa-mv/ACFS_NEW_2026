import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { APIClient } from "../../../api-clients/APIClient";
import { ENV } from "../../../config/env";
import { UserService } from "../../../services/UserService";
import { CustomWorld } from "../../../playwright-utils/world";
import { APIManager } from "../../../utils/apiManager";

When("I fetch user details", async function (this: CustomWorld) {
  this.apiContext = await APIManager.newContext(ENV.userApiUrl);
  const users = new UserService(new APIClient(this.apiContext));
  this.response = await users.getUser(1);
  this.responseBody = await this.response.json();
  this.attach(JSON.stringify(this.responseBody, null, 2), "application/json");
});

Then("API response status should be {int}", async function (this: CustomWorld, status: number) {
  expect(this.response?.status()).toBe(status);
});

Then("user id should be {int}", async function (this: CustomWorld, id: number) {
  expect(this.responseBody.id).toBe(id);
});

Then("user name should be {string}", async function (this: CustomWorld, name: string) {
  expect(this.responseBody.name).toBe(name);
});

Then("user email should be {string}", async function (this: CustomWorld, email: string) {
  expect(this.responseBody.email).toBe(email);
});
