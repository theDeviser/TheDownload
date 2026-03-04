import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the navbar with logo", async ({ page }) => {
    const logo = page.locator("header").getByText("The Download");
    await expect(logo).toBeVisible();
  });

  test("renders the hero heading", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toContainText("doom-scrolling");
  });

  test("displays Get Started and Demo CTA buttons", async ({ page }) => {
    const getStarted = page.getByRole("link", { name: /get started free/i });
    await expect(getStarted).toBeVisible();
    await expect(getStarted).toHaveAttribute("href", "/auth/signup");

    const demo = page.getByRole("link", { name: /see a demo/i });
    await expect(demo).toBeVisible();
    await expect(demo).toHaveAttribute("href", "/demo");
  });

  test("renders the How It Works section", async ({ page }) => {
    const howItWorks = page.getByRole("heading", { name: /how it works/i });
    await expect(howItWorks).toBeVisible();

    await expect(page.getByText("Curate")).toBeVisible();
    await expect(page.getByText("Translate")).toBeVisible();
    await expect(page.getByText("Share")).toBeVisible();
  });

  test("renders the features section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /built for curators/i }),
    ).toBeVisible();
  });

  test("navbar sign in button links to login", async ({ page }) => {
    const signIn = page
      .locator("header")
      .getByRole("link", { name: /sign in/i });
    await expect(signIn).toHaveAttribute("href", "/auth/login");
  });
});
