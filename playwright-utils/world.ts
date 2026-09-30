import { IWorldOptions, World, setWorldConstructor } from "@cucumber/cucumber";
import { APIRequestContext, APIResponse, BrowserContext, Page } from "@playwright/test";
import { resolveTokens } from "../utils/testDataTokens";
import { PageManager } from "./pageManager";
import { StepOverlay } from "./stepOverlay";

/** State shared by the steps of ONE scenario. A fresh instance is created per scenario. */
export class CustomWorld extends World {
  context!: BrowserContext;
  page!: Page;
  pages!: PageManager;
  overlay?: StepOverlay;
  consoleErrors: string[] = [];

  // API scenarios
  apiContext?: APIRequestContext;
  response?: APIResponse;
  responseBody?: any;

  private readonly resolved = new Map<string, string>();

  /** Resolve {{tokens}} once per distinct text, so "upload X" and "verify X" steps see the same value. */
  resolve(text: string): string {
    if (!this.resolved.has(text)) this.resolved.set(text, resolveTokens(text));
    return this.resolved.get(text)!;
  }

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
