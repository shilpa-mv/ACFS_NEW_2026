# ACFS Connect – UI + API test automation

Cucumber.js (Gherkin) · Playwright · TypeScript · Allure

## Quick start

```bash
npm ci
npx playwright install chromium
cp .env.example .env        # then fill in the values
npm run test:smoke
npm run report:serve        # open the Allure report
```

## Project layout

| Folder | Purpose |
|---|---|
| `tests/feature/{ui,api}` | Gherkin scenarios – business language only, no credentials, no selectors |
| `tests/step-definitions` | Thin glue: parse the step, call a page object / service |
| `pages/` | Page objects. All locators and UI actions live here |
| `playwright-utils/` | `world.ts` (per-scenario state), `hooks.ts` (browser, video, trace, screenshots), `pageManager.ts`, `browserManager.ts`, `networkTracker.ts`, `stepOverlay.ts` |
| `api-clients/`, `services/` | HTTP client and one service class per API area |
| `config/env.ts` | The only place that reads `process.env` |
| `utils/` | Logger, TOTP, data-table parsing, `{{token}}` data, date helpers |
| `test-data/files/` | Files uploaded by tests (e.g. the pre-alert PDF) |
| `cucumber.js` | Profiles: `default`, `smoke`, `regression`, `ui`, `api`, `ci` |

## Running

| Command | What it runs |
|---|---|
| `npm test` | Everything except `@wip` |
| `npm run test:smoke` / `test:regression` / `test:ui` / `test:api` | Tag-based profiles |
| `TAGS="@Exceptions" npm test` | Any tag expression (`set TAGS=...` on Windows cmd; `$env:TAGS=...` in PowerShell) |
| `PARALLEL=2 npm test` | Parallel workers (each gets its own browser) |
| `npm run test:dry` | Validates every step is defined, no browser needed |
| `npm run typecheck` | TypeScript check |
| `npm run clean` | Delete allure-results, allure-report and test-results |
| `npx cucumber-js tests/feature/ui/login.feature` | One feature file |

## Evidence (video, trace, screenshot)

Controlled from `.env` (`VIDEO`, `TRACE`, `SCREENSHOT_ON_FAILURE`, `STEP_OVERLAY`). By default a **failed** scenario keeps a
video, a trace and a full-page screenshot, all attached to the Allure report; passing scenarios keep nothing.
Open a trace with `npx playwright show-trace test-results/traces/<file>.zip`.
Set `STEP_OVERLAY=true` to burn the current Gherkin step into the video as a caption (useful for demos).

## Conventions

- **Tags:** `@UI` / `@API` (type), `@smoke`, `@regression`, one tag per feature area, `@wip` = excluded from every profile.
- **No fixed sleeps.** Use auto-waiting `expect(...)` or `waitForUiIdle()`. `page.pause()` must never be committed – it hangs CI.
- **No credentials in features.** Add them to `.env` as `CP_<ROLE>_USERNAME/PASSWORD` and use
  `I sign in to the Customer Portal as the <role> user`.
- **Unique test data:** use tokens in tables – `CRN{{digits:6}}`, `{{alpha:4}}`, `{{timestamp}}`. In a scenario, the same text always resolves to the same value.
- **Steps stay thin**, page objects stay free of Gherkin knowledge except `DataTable`-shaped interfaces (`OrderDetails`, `DeliveryDetails`).
- **Add a page:** create `pages/x.page.ts` extending `BasePage`, expose it in `PageManager`, then use `this.pages.x` in steps.
- **Add an environment variable:** add it to `config/env.ts` and `.env.example` only.

## CI (Bitbucket)

`bitbucket-pipelines.yml`: pull requests run typecheck + dry-run + smoke; `master`/`main` runs the regression suite (2 workers);
a custom pipeline runs any `TAGS`. Add the `.env.example` values as secured repository variables. `allure-results/` and
`test-results/` are stored as artifacts.

## Known gaps

- `tests/feature/ui/prealert.feature` is tagged `@wip`: the step `Create an Order with the "<container>" Container` is not implemented.
- `ContainersPage.firstContainerLink` still uses a very long absolute CSS path; ask the portal team for a stable `id`/`data-testid`.
- `package.json` still contains unused dependencies (`otplib`, `allure-playwright`, `playwright`, and the Allure 3 `allure` package next to `allure-commandline`). Run `npm uninstall otplib allure-playwright playwright allure` and commit the new lock file when convenient.
