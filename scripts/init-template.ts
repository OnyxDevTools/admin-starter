import { readFile, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { z } from "zod";
import { projectIdentitySchema } from "../lib/project.ts";

const { values } = parseArgs({
  options: { name: { type: "string" }, slug: { type: "string" } },
  strict: true,
});
const identity = projectIdentitySchema.safeParse(values);
if (!identity.success) {
  console.error(
    "Usage: npm run template:init -- --name 'My Admin' --slug my-admin",
  );
  for (const issue of identity.error.issues)
    console.error(`${issue.path.join(".")}: ${issue.message}`);
  process.exitCode = 1;
} else {
  // Parse every file before writing. Preserve dependencies and lockfile resolutions.
  const packageSchema = z.object({ name: z.string() }).passthrough();
  const packageJson = packageSchema.parse(
    JSON.parse(await readFile("package.json", "utf8")),
  );
  const lock = z
    .object({
      name: z.string(),
      packages: z.object({ "": packageSchema }).passthrough(),
    })
    .passthrough()
    .parse(JSON.parse(await readFile("package-lock.json", "utf8")));
  packageJson.name = identity.data.slug;
  lock.name = identity.data.slug;
  lock.packages[""].name = identity.data.slug;
  for (const [file, content] of [
    ["project.json", identity.data],
    ["package.json", packageJson],
    ["package-lock.json", lock],
  ] as const) {
    await writeFile(file, `${JSON.stringify(content, null, 2)}\n`);
  }
  console.log(`Initialized ${identity.data.name} (${identity.data.slug}).`);
}
