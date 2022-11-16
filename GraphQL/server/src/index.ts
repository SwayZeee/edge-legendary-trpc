import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import TodoService from "./services/todo.service";
import { TodoInput, TodoUpdate } from "./interfaces/todo";

interface MyContext {
  token?: String;
}

const typeDefs = `
  type Todo {
    id: Int!
    title: String!
    isDone: Boolean!
  }

  input TodoInput {
    title: String!
  }

  input TodoUpdate {
    title: String!
    isDone: Boolean!
  }

  type Query {
    todos: [Todo]
  }

  type Mutation {
    addTodo(newTodo: TodoInput): Todo
    updateTodo(id: Int, updateTodo: TodoUpdate): Todo
    deleteTodo(id: Int): Todo
  }
`;

const resolvers = {
  Query: {
    todos: () => TodoService.getTodos(),
  },
  Mutation: {
    addTodo: (_, input) => {
      const newTodo: TodoInput = input.newTodo;
      return TodoService.createTodo(newTodo);
    },
    updateTodo: (_, input) => {
      const id: number = input.id;
      const updateTodo: TodoUpdate = input.updateTodo;
      return TodoService.updateTodo(id, updateTodo);
    },
    deleteTodo: (_, input) => {
      const id: number = input.id;
      return TodoService.deleteTodoById(id);
    },
  },
};

const app = express();

const httpServer = http.createServer(app);

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/",
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve)
);
console.log(`🚀 Server ready at http://localhost:4000/`);
