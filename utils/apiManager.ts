import { APIRequestContext, request } from "@playwright/test";

export class APIManager {
  static async newContext(baseURL: string): Promise<APIRequestContext> {
    return request.newContext({
      baseURL,
      ignoreHTTPSErrors: true,
      extraHTTPHeaders: { "Content-Type": "application/json", Accept: "application/json" },
    });
  }
}
