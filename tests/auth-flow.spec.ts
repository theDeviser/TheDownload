import { test, expect } from "@playwright/test";

test.describe("Auth Flow", () => {
  test("login page renders email and password fields", async ({ page }) => {
    await page.goto("/auth/login");

    const emailInput = page.getByPlaceholder(/email/i);
    await expect(emailInput).toBeVisible();

    const passwordInput = page.getByPlaceholder(/password/i);
    await expect(passwordInput).toBeVisible();
  });

  test("login page has a submit button", async ({ page }) => {
    await page.goto("/auth/login");

    const submitButton = page.getByRole("button", { name: /sign in/i });
    await expect(submitButton).toBeVisible();
  });

  test("login page has link to signup", async ({ page }) => {
    await page.goto("/auth/login");

    const signupLink = page.getByRole("link", { name: /sign up/i });
    await expect(signupLink).toBeVisible();
  });

  test("signup page renders form fields", async ({ page }) => {
    await page.goto("/auth/signup");

    await expect(page.getByPlaceholder(/name/i)).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
  });

  test("unauthenticated user visiting /dashboard is redirected to login", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/\/auth\/login/);
    expect(page.url()).toContain("/auth/login");
  });
});
