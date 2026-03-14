/**
 * NextGen TMS – product demo video recording.
 *
 * Prerequisites:
 * - App running: npm run dev (http://localhost:3000)
 * - For dashboard/shipments/tracking: set DEMO_EMAIL and DEMO_PASSWORD
 *   (Supabase user with dispatcher or admin role; ensure at least one customer exists)
 *
 * Run: npm run test:demo-video
 * Video is saved under demo-videos/
 */
import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const DEMO_EMAIL = process.env.DEMO_EMAIL;
const DEMO_PASSWORD = process.env.DEMO_PASSWORD;

test.describe("NextGen TMS Demo Video", () => {
  test("records product demo workflow", async ({ page }) => {
    // ——— Step 1: Landing page ———
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // ——— Step 2: Scroll to features section ———
    await page.locator("#features").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // ——— Step 3: Navigate to Dashboard (may hit login) ———
    await page.getByRole("link", { name: "View Dashboard" }).click();
    await page.waitForTimeout(1500);

    if (page.url().includes("/login") && DEMO_EMAIL && DEMO_PASSWORD) {
      await page.getByLabel("Email").fill(DEMO_EMAIL);
      await page.getByLabel("Password").fill(DEMO_PASSWORD);
      await page.getByRole("button", { name: "Login" }).click();
      await page.waitForURL(/\/dashboard|\/shipments/, { timeout: 15000 });
      await page.waitForTimeout(1500);
    }

    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // ——— Step 4: Shipments page ———
    await page.getByRole("link", { name: "Shipments" }).click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    const customerSelect = page.locator("#customerId");
    if (await customerSelect.isVisible()) {
      const options = await customerSelect.locator("option").allTextContents();
      if (options.length > 1) {
        await customerSelect.selectOption({ index: 1 });
      }
    }

    await page.getByLabel("Origin Location").fill("Ahmedabad");
    await page.getByLabel("Destination Location").fill("Mumbai");
    await page.getByLabel("Weight (kg)").fill("1200");
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: /Create Shipment|Submit Request/ }).click();
    await page.waitForTimeout(2000);

    // ——— Step 5: Open first shipment details ———
    const firstShipmentLink = page.locator('a[href^="/shipments/"]').first();
    await expect(firstShipmentLink).toBeVisible({ timeout: 5000 });
    await firstShipmentLink.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // ——— Step 6: Tracking page ———
    await page.getByRole("link", { name: "Tracking" }).click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2500);

    // ——— Step 7: Return to dashboard ———
    await page.getByRole("link", { name: "Dashboard" }).click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
  });
});
