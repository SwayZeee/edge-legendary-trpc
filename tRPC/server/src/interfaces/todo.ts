import { z } from "zod";

export const ZTodo = z.object({
  id: z.number(),
  title: z.string(),
  isDone: z.boolean(),
});

export type Todo = z.infer<typeof ZTodo>;

export const ZTodoInput = z.object({
  title: z.string(),
});

export type TodoInput = z.infer<typeof ZTodoInput>;
