import { Page } from "@playwright/test";

/** Shows the current Gherkin step as a caption bar so recorded videos explain themselves. */
export class StepOverlay {
  private current = "";

  constructor(private readonly page: Page) {
    // Re-draw after full page navigations (the DOM is replaced).
    page.on("domcontentloaded", () => void this.render());
  }

  async show(text: string): Promise<void> {
    this.current = text;
    await this.render();
  }

  private async render(): Promise<void> {
    if (!this.current) return;
    await this.page
      .evaluate((text) => {
        let bar = document.getElementById("__step_overlay");
        if (!bar) {
          bar = document.createElement("div");
          bar.id = "__step_overlay";
          bar.style.cssText =
            "position:fixed;left:0;right:0;bottom:0;z-index:2147483647;padding:10px 16px;" +
            "background:rgba(15,42,92,.92);color:#fff;font:600 18px Arial,sans-serif;pointer-events:none";
          document.documentElement.appendChild(bar);
        }
        bar.textContent = text;
      }, this.current)
      .catch(() => undefined); // page may be navigating or closed
  }
}
