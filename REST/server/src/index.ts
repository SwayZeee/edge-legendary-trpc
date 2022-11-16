import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import TodoService from "./services/todo.service";
import { TodoInput, TodoUpdate } from "./interfaces/todo";

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

app.get("/api/v1/todos", (req, res) => {
  res.status(200).json(TodoService.getTodos());
});

app.get("/api/v1/todos/:id", (req, res) => {
  res.status(200).json(TodoService.getTodoById(parseInt(req.params.id)));
});

app.post("/api/v1/todos", (req, res) => {
  const todo: TodoInput = req.body;
  res.status(201).json(TodoService.createTodo(todo));
});

app.put("/api/v1/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todoUpdate: TodoUpdate = req.body;
  res.status(200).json(TodoService.updateTodo(id, todoUpdate));
});

app.delete("/api/v1/todos/:id", (req, res) => {
  res.status(200).json(TodoService.deleteTodoById(parseInt(req.params.id)));
});

app.listen(port, () => {
  console.log(`REST-SERVER: listening on port ${port}`);
});
