import { Page } from "@playwright/test";
import { CollectionschedulePage } from "../pages/collectionschedule.page";
import { ContainersPage } from "../pages/containers.page";
import { CPDashboard } from "../pages/cpdashboard.page";
import { CPLoginPage } from "../pages/cplogin.page";
import { CPPortal } from "../pages/cpportal.page";
import { CSPLoginPage } from "../pages/csplogin.page";
import { DeliverySchedule } from "../pages/deliveryschedule.page";
import { ExceptionsPage } from "../pages/exceptions.page";
import { OrdersPage } from "../pages/orders.page";
import { PorttimeslotPage } from "../pages/porttimeslot.page";
import { PreAlertsPage } from "../pages/prealerts.page";

/** Creates each page object once per scenario, on first use. */
export class PageManager {
  private readonly cache = new Map<string, unknown>();

  constructor(private readonly page: Page) {}

  private resolve<T>(key: string, create: (page: Page) => T): T {
    if (!this.cache.has(key)) this.cache.set(key, create(this.page));
    return this.cache.get(key) as T;
  }

  get cspLogin(): CSPLoginPage { return this.resolve("cspLogin", (p) => new CSPLoginPage(p)); }
  get cpLogin(): CPLoginPage { return this.resolve("cpLogin", (p) => new CPLoginPage(p)); }
  get dashboard(): CPDashboard { return this.resolve("dashboard", (p) => new CPDashboard(p)); }
  get portal(): CPPortal { return this.resolve("portal", (p) => new CPPortal(p)); }
  get orders(): OrdersPage { return this.resolve("orders", (p) => new OrdersPage(p)); }
  get containers(): ContainersPage { return this.resolve("containers", (p) => new ContainersPage(p)); }
  get exceptions(): ExceptionsPage { return this.resolve("exceptions", (p) => new ExceptionsPage(p)); }
  get preAlerts(): PreAlertsPage { return this.resolve("preAlerts", (p) => new PreAlertsPage(p)); }
  get deliverySchedule(): DeliverySchedule { return this.resolve("deliverySchedule", (p) => new DeliverySchedule(p)); }
  get collectionSchedule(): CollectionschedulePage { return this.resolve("collectionSchedule", (p) => new CollectionschedulePage(p)); }
  get portTimeslot(): PorttimeslotPage { return this.resolve("portTimeslot", (p) => new PorttimeslotPage(p)); }
}
