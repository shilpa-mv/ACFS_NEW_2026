import { APIRequestContext, APIResponse } from "@playwright/test";
import { Logger } from "../utils/logger";

export class APIClient {
  constructor(private readonly apiContext: APIRequestContext) {}

  private async log(method: string, endpoint: string, call: Promise<APIResponse>): Promise<APIResponse> {
    const started = Date.now();
    const response = await call;
    Logger.info(`${method} ${endpoint} -> ${response.status()} (${Date.now() - started} ms)`);
    return response;
  }

  get(endpoint: string): Promise<APIResponse> {
    return this.log("GET", endpoint, this.apiContext.get(endpoint));
  }

  post(endpoint: string, payload: unknown): Promise<APIResponse> {
    return this.log("POST", endpoint, this.apiContext.post(endpoint, { data: payload }));
  }

  put(endpoint: string, payload: unknown): Promise<APIResponse> {
    return this.log("PUT", endpoint, this.apiContext.put(endpoint, { data: payload }));
  }

  delete(endpoint: string): Promise<APIResponse> {
    return this.log("DELETE", endpoint, this.apiContext.delete(endpoint));
  }
}
