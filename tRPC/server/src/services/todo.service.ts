import { Todo, TodoInput } from "../interfaces/todo";

let todos: Todo[] = [
  {
    id: 0,
    title: "Buy milk",
    isDone: true,
  },
  {
    id: 1,
    title: "Clean bathroom",
    isDone: false,
  },
];

const getTodos = (): Todo[] => {
  return todos;
};

const getTodoById = (id: number): Todo | undefined => {
  return todos.find((element) => element.id === id);
};

const createTodo = (todoInput: TodoInput): Todo => {
  const newTodo: Todo = {
    id: Math.floor(Math.random() * 1000000), // not really unique
    title: todoInput.title,
    isDone: false,
  };

  todos.push(newTodo);
  return newTodo;
};

const updateTodo = (todoUpdate: Todo): Todo => {
  const updatedTodo: Todo = {
    id: todoUpdate.id,
    title: todoUpdate.title,
    isDone: todoUpdate.isDone,
  };
  const index = todos.findIndex((element) => element.id === todoUpdate.id);
  todos.splice(index, 1, updatedTodo);
  return updatedTodo;
};

const deleteTodoById = (id: number): Todo | undefined => {
  const todoToDelete = todos.find((element) => element.id === id);
  todos = todos.filter((element) => element.id !== id);
  return todoToDelete;
};

const TodoService = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodoById,
};

export default TodoService;
