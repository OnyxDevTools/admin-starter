import { defineConfig, devices } from "@playwright/test";

// Fail on collisions; never run this suite against a server from another project.
const port = Number(process.env.E2E_PORT ?? 3217);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("E2E_PORT must be between 1 and 65535.");
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: "html",
  use: { baseURL, trace: "on-first-retry" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: `npm run build && npm run start -- --port ${port}`,
    url: `${baseURL}/api/health`,
    reuseExistingServer: false,
  },
});
