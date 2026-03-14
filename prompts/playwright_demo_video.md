You are a senior QA automation engineer and full stack developer.

Create a Playwright automation script that records a product demo video for a web application.

Application:
NextGen Transportation Management System (TMS)

Tech stack:

- Next.js 15
- Supabase backend
- Tailwind CSS
- Playwright

Goal:
Generate a Playwright script that automatically navigates through the app and records a demo video showing the product features.

Requirements:

1. Setup Playwright configuration

- Enable video recording
- Store videos in "demo-videos/" folder
- Use viewport 1920x1080
- Use Chromium browser

2. Create a Playwright test file called:

tests/demo-video.spec.ts

3. The script should demonstrate the product workflow.

Demo Flow:

Step 1:
Open landing page
http://localhost:3000

Wait 3 seconds so hero section is visible.

Step 2:
Scroll to features section.

Step 3:
Navigate to Dashboard page.

Show metrics:

- Total Shipments
- Active Drivers
- In Transit Deliveries

Wait 3 seconds.

Step 4:
Navigate to Shipments page.

Click "Create Shipment"

Fill form example:

Origin: Ahmedabad
Destination: Mumbai
Weight: 1200 kg

Submit form.

Wait 2 seconds.

Step 5:
Open shipment details page.

Step 6:
Open tracking page.

Show shipment tracking timeline.

Step 7:
Return to dashboard.

Wait 2 seconds.

4. The script should include:

smooth pauses
realistic navigation
clear demonstration of UI

Use:

await page.waitForTimeout()

between steps.

5. Also generate:

playwright.config.ts configuration.

Example configuration requirements:

video recording enabled
video saved automatically
test-results folder configured

6. The output should include:

playwright.config.ts
tests/demo-video.spec.ts

Focus on producing a smooth product demo recording suitable for hackathon presentation.
