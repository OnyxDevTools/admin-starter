import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import project from "../project.json";

test("identifies the generated app through health and branding", async ({
  request,
  page,
}) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual({
    application: project.slug,
    status: "ok",
  });
  await page.goto("/projects");
  await expect(page).toHaveTitle(`Projects · ${project.name}`);
  await expect(
    page.getByRole("link", { name: `${project.name} home` }),
  ).toBeVisible();
});

test("filters, paginates, validates, creates and edits demo projects", async ({
  page,
}) => {
  await page.goto("/projects");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("6 projects · Page 2 of 2");
  await page.getByRole("button", { name: "Previous", exact: true }).click();
  await page
    .getByRole("searchbox", { name: "Search projects" })
    .fill("customer");
  await expect(
    page.getByRole("cell", { name: "Customer portal", exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/q=customer/);
  await page.reload();
  await expect(
    page.getByRole("searchbox", { name: "Search projects" }),
  ).toHaveValue("customer");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByRole("combobox", { name: "Filter by status" }).click();
  await page.getByRole("option", { name: "Archived", exact: true }).click();
  await expect(
    page.getByRole("cell", { name: "Legacy migration", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("searchbox", { name: "Search projects" })
    .fill("nothing-matches");
  await expect(
    page.getByText("No matching projects. Clear filters to try again."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByRole("button", { name: "New project", exact: true }).click();
  await page
    .getByRole("button", { name: "Create project", exact: true })
    .click();
  await expect(page.getByText("Enter at least two characters.")).toBeVisible();
  await page
    .getByRole("textbox", { name: "Project name", exact: true })
    .fill("Access audit");
  await page
    .getByRole("textbox", { name: "Owner email" })
    .fill("owner@example.com");
  const scan = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .analyze();
  expect(
    scan.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    ),
  ).toEqual([]);
  await page
    .getByRole("button", { name: "Create project", exact: true })
    .click();
  await expect(
    page.getByRole("cell", { name: "Access audit", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Edit Access audit", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Project name", exact: true })
    .fill("Access review");
  await page.getByRole("button", { name: "Save project", exact: true }).click();
  await expect(
    page.getByRole("cell", { name: "Access review", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("cell", { name: "Access review", exact: true }),
  ).toHaveCount(0);
});

test("bounds invalid pages and returns focus after cancelling an edit", async ({
  page,
}) => {
  await page.goto("/projects?page=-10&status=invalid");
  await expect(page.getByRole("status")).toHaveText("6 projects · Page 1 of 2");
  const edit = page.getByRole("button", {
    name: "Edit Analytics workspace",
    exact: true,
  });
  await edit.click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(edit).toBeFocused();
});
