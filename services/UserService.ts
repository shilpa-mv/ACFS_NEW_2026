import { APIResponse } from "@playwright/test";
import { APIClient } from "../api-clients/APIClient";

export class UserService {
  constructor(private readonly apiClient: APIClient) {}

  getUser(id: number): Promise<APIResponse> {
    return this.apiClient.get(`/users/${id}`);
  }
}
