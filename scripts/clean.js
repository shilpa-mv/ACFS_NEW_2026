// Cross-platform replacement for the old "rmdir /s /q ..." npm scripts.
const fs = require("fs");
for (const dir of ["allure-results", "allure-report", "test-results"]) {
  fs.rmSync(dir, { recursive: true, force: true });
}
console.log("Cleaned allure-results, allure-report and test-results");
