import { execFileSync, spawn } from "node:child_process";
import { cp, mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { setTimeout } from "node:timers/promises";

const directory = await mkdtemp(join(tmpdir(), "admin-starter-smoke-"));
const excluded = new Set([
  ".git",
  "node_modules",
  ".next",
  ".next-build",
  "playwright-report",
  "test-results",
  "config",
]);
let server: ReturnType<typeof spawn> | undefined;
try {
  await cp(process.cwd(), directory, {
    recursive: true,
    filter: (source) => {
      const name = basename(source);
      return (
        !excluded.has(name) &&
        !name.startsWith("onyx-database") &&
        !(name.startsWith(".env") && name !== ".env.example") &&
        !name.endsWith(".tsbuildinfo") &&
        !name.endsWith(".log")
      );
    },
  });
  const run = (args: string[]) =>
    execFileSync("npm", args, {
      cwd: directory,
      stdio: "inherit",
      env: { ...process.env, HUSKY: "0" },
      timeout: 240_000,
    });
  run(["ci", "--no-audit", "--no-fund"]);
  run([
    "run",
    "template:init",
    "--",
    "--name",
    "Smoke Admin",
    "--slug",
    "smoke-admin",
  ]);
  const identity: unknown = JSON.parse(
    await readFile(join(directory, "project.json"), "utf8"),
  );
  if (
    JSON.stringify(identity) !==
    JSON.stringify({ name: "Smoke Admin", slug: "smoke-admin" })
  )
    throw new Error("Project initialization failed.");
  run(["run", "build"]);
  const listener = createServer();
  await new Promise<void>((resolve, reject) => {
    listener.once("error", reject);
    listener.listen(0, "127.0.0.1", resolve);
  });
  const address = listener.address();
  if (!address || typeof address === "string")
    throw new Error("Unable to allocate smoke port.");
  const port = address.port;
  await new Promise<void>((resolve, reject) =>
    listener.close((error) => (error ? reject(error) : resolve())),
  );
  server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    { cwd: directory, stdio: "inherit" },
  );
  let startError: Error | undefined;
  server.once("error", (error) => {
    startError = error;
  });
  const origin = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (startError) throw startError;
    if (server.exitCode !== null)
      throw new Error("Smoke server exited before becoming ready.");
    try {
      const response = await fetch(`${origin}/api/health`, {
        signal: AbortSignal.timeout(1000),
      });
      const body: unknown = await response.json();
      if (
        response.ok &&
        JSON.stringify(body) ===
          JSON.stringify({ application: "smoke-admin", status: "ok" })
      ) {
        ready = true;
        break;
      }
    } catch {
      /* Retry while the child process starts. */
    }
    await setTimeout(250);
  }
  if (!ready) throw new Error("Smoke health check did not become ready.");
  for (const route of ["/", "/projects", "/settings"]) {
    const response = await fetch(`${origin}${route}`, {
      signal: AbortSignal.timeout(10_000),
    });
    const html = await response.text();
    if (
      !response.ok ||
      !html.includes("Smoke Admin") ||
      html.includes("Admin Starter home")
    )
      throw new Error(`Smoke route failed: ${route}`);
  }
  console.log(
    "Fresh template install, naming, build, health, and route smoke checks passed.",
  );
} finally {
  if (server && server.exitCode === null) {
    const stopped = new Promise<void>((resolve) =>
      server?.once("exit", () => resolve()),
    );
    server.kill("SIGTERM");
    await Promise.race([stopped, setTimeout(5000)]);
    if (server.exitCode === null) {
      server.kill("SIGKILL");
      await stopped;
    }
  }
  await rm(directory, { recursive: true, force: true });
}
