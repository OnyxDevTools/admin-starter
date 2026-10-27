import "server-only";
import { asc, eq } from "@onyx.dev/onyx-database";
import { createDatabase } from "./client.ts";
import { taskSchema, type Task } from "./task-model.ts";

function title(value: string) {
  const normalized = value.trim();
  if (!normalized || normalized.length > 200)
    throw new Error("Task title must contain 1–200 characters.");
  return normalized;
}
function identifier(value: string) {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(value))
    throw new Error("Invalid task identifier.");
  return value;
}
function task(value: unknown): Task {
  return taskSchema.parse(value);
}

// Server-owned repository. Call only after your application's authorization check.
// Edits are last-write-wins; no transaction or compare-and-swap is implied.
async function safely<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch {
    throw new Error(
      "Onyx task operation failed. Check input, downloaded configuration, database availability, and schema.",
    );
  }
}

export function createTasks() {
  const db = createDatabase();
  return {
    list(cursor?: string) {
      return safely(async () => {
        if (cursor && cursor.length > 4096) throw new Error("Invalid cursor.");
        const page = await db
          .from("Task")
          .orderBy(asc("id"))
          .page({ pageSize: 20, ...(cursor ? { nextPage: cursor } : {}) });
        return { items: page.records.map(task), cursor: page.nextPage };
      });
    },
    get(id: string) {
      return safely(async () => {
        const row = await db.findById("Task", identifier(id));
        return row == null ? null : task(row);
      });
    },
    create(value: string) {
      return safely(async () => {
        const row = {
          id: crypto.randomUUID(),
          title: title(value),
          completed: false,
        };
        await db.insert("Task", row);
        return row;
      });
    },
    update(id: string, value: string, completed: boolean) {
      return safely(async () => {
        if (typeof completed !== "boolean")
          throw new Error("Completed must be boolean.");
        const count = await db
          .from("Task")
          .where(eq("id", identifier(id)))
          .setUpdates({ title: title(value), completed })
          .update();
        if (count !== 0 && count !== 1)
          throw new Error("Unexpected update response.");
        return count === 1;
      });
    },
    remove(id: string) {
      return safely(async () => {
        const count = await db
          .from("Task")
          .where(eq("id", identifier(id)))
          .delete();
        if (count !== 0 && count !== 1)
          throw new Error("Unexpected delete response.");
        return count === 1;
      });
    },
  };
}
