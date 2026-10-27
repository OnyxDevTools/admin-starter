import { z } from "zod";

export const taskSchema = z
  .object({
    id: z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/),
    title: z.string().trim().min(1).max(200),
    completed: z.boolean(),
  })
  .strict();
export type Task = z.infer<typeof taskSchema>;
