// @filename: server.ts
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import { z } from "zod";
import TodoService from "./services/todo.service";
import { ZTodo, ZTodoInput } from "./interfaces/todo";

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  todos: t.procedure.query(() => {
    return TodoService.getTodos();
  }),
  createTodo: t.procedure.input(ZTodoInput).mutation((req) => {
    return TodoService.createTodo({
      title: req.input.title,
    });
  }),
  updateTodo: t.procedure.input(ZTodo).mutation((req) => {
    return TodoService.updateTodo(req.input);
  }),
  deleteTodo: t.procedure
    .input(z.object({ id: z.number() }))
    .mutation((req) => {
      return TodoService.deleteTodoById(req.input.id);
    }),
});

export type AppRouter = typeof appRouter;

const app = express();

app.use(cors());

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(4000);
