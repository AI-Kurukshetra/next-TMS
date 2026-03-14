import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [["html", { outputFolder: "test-results/html" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    video: "on",
    screenshot: "only-on-failure",
    viewport: { width: 1920, height: 1080 },
    launchOptions: {
      slowMo: 100,
    },
  },
  outputDir: "test-results/",
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        video: {
          dir: "demo-videos",
          size: { width: 1920, height: 1080 },
        },
      },
    },
  ],
});
