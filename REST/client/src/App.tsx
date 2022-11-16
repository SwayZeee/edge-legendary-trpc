import {
  Button,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  TableBody,
  Paper,
} from "@mui/material";
import { Refresh, DeleteOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState<any>(undefined);
  const [inputNewTodo, setInputNewTodo] = useState("");

  const fetchTodos = async () => {
    const fetchTodosRequest = new Request(
      "http://localhost:3000/api/v1/todos",
      {
        method: "GET",
      }
    );
    const response = await fetch(fetchTodosRequest);
    const json = await response.json();
    setTodos(json);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleChange = (e: any) => {
    const { value } = e.target;
    setInputNewTodo(value);
  };

  const addTodo = async () => {
    const todoInput = {
      title: inputNewTodo,
    };

    const addTodoRequest = new Request("http://localhost:3000/api/v1/todos", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(todoInput),
    });
    await fetch(addTodoRequest);
    await fetchTodos();
  };

  const toggleIsDone = async (todo: any) => {
    const todoUpdate = {
      ...todo,
      isDone: !todo.isDone,
    };
    const updateTodoRequest = new Request(
      `http://localhost:3000/api/v1/todos/${todo.id}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(todoUpdate),
      }
    );
    await fetch(updateTodoRequest);
    await fetchTodos();
  };

  const deleteTodoById = async (id: string) => {
    const deleteTodoRequest = new Request(
      `http://localhost:3000/api/v1/todos/${id}`,
      {
        method: "DELETE",
      }
    );
    await fetch(deleteTodoRequest);
    await fetchTodos();
  };

  return (
    <div className="App">
      <h1>REST Todo Client Example</h1>

      <IconButton
        size="small"
        color="primary"
        onClick={async () => fetchTodos()}
      >
        <Refresh />
      </IconButton>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTodo();
          setInputNewTodo("");
        }}
      >
        <TextField
          id="input"
          label="Add new todo"
          value={inputNewTodo}
          onChange={handleChange}
        ></TextField>
      </form>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="right">Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todos &&
              todos.map((todo: any) => (
                <TableRow key={todo.id}>
                  <TableCell component="th" scope="row">
                    {todo.isDone ? (
                      <Button
                        variant="text"
                        sx={{
                          textTransform: "none",
                          textDecoration: "line-through",
                          ":hover": { textDecoration: "line-through" },
                        }}
                        onClick={() => {
                          toggleIsDone(todo);
                        }}
                      >
                        {todo.title}
                      </Button>
                    ) : (
                      <Button
                        variant="text"
                        sx={{
                          textTransform: "none",
                        }}
                        onClick={() => {
                          toggleIsDone(todo);
                        }}
                      >
                        {todo.title}
                      </Button>
                    )}
                  </TableCell>

                  <TableCell align="right">
                    {todo.isDone && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={async () => deleteTodoById(todo.id)}
                      >
                        <DeleteOutlined />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
