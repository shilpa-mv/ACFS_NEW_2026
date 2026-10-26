/**
 * Cucumber profiles. Run with:  npx cucumber-js --profile smoke
 * Tags:   @smoke  @regression  @UI  @API  @wip (never runs by default)
 * Extra:  PARALLEL=2 (workers)  RETRY=1  TAGS="@Exceptions"  (see README)
 */
const parallel = Number(process.env.PARALLEL ?? 1);
const retry = Number(process.env.RETRY ?? (process.env.CI ? 1 : 0));

const common = {
  paths: ["tests/feature/**/*.feature"],
  requireModule: ["ts-node/register"],
  require: ["playwright-utils/world.ts", "playwright-utils/hooks.ts", "tests/step-definitions/**/*.ts"],
  format: [
    "progress-bar",
    "allure-cucumberjs/reporter",
    "html:test-results/cucumber-report.html",
    "json:test-results/cucumber-report.json",
  ],
  formatOptions: { resultsDir: "allure-results" },
  parallel,
  retry,
  ...(retry > 0 ? { retryTagFilter: "not @API" } : {}), // cucumber rejects retryTagFilter when retry is 0
};

const notWip = "not @wip";
const withTags = (tags) => process.env.TAGS ?? tags;

module.exports = {
  default: { ...common, tags: withTags(notWip) },
  smoke: { ...common, tags: withTags(`@smoke and ${notWip}`) },
  regression: { ...common, tags: withTags(`@regression and ${notWip}`) },
  ui: { ...common, tags: withTags(`@UI and ${notWip}`) },
  api: { ...common, format: ["progress-bar", "allure-cucumberjs/reporter"], tags: withTags(`@API and ${notWip}`) },
  ci: { ...common, format: ["summary", "allure-cucumberjs/reporter", "junit:test-results/junit.xml", "html:test-results/cucumber-report.html"], tags: withTags(`@regression and ${notWip}`) },
};
