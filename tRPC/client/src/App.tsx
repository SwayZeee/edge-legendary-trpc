import {
  Button,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Paper,
} from "@mui/material";
import { Refresh, DeleteOutlined } from "@mui/icons-material";
import "./App.css";
import { trpc } from "./utils/trpc";
import { useState } from "react";

function App() {
  const [inputNewTodo, setInputNewTodo] = useState("");

  const handleChange = (e: any) => {
    const { value } = e.target;
    setInputNewTodo(value);
  };

  // based on React Query / TanStack Query (https://tanstack.com/query/v4/docs/overview)
  const { data, refetch } = trpc.todos.useQuery(undefined, {
    // enabled: false, to not automatically fetch
  });

  const createTodoMutation = trpc.createTodo.useMutation();
  const handleCreateTodo = async (title: string) => {
    createTodoMutation.mutate(
      { title },
      {
        onSuccess: () => refetch(),
      }
    );
  };

  const updateTodoMutation = trpc.updateTodo.useMutation();
  const toggleIsDone = async (todo: any) => {
    updateTodoMutation.mutate(
      {
        id: todo.id,
        title: todo.title,
        isDone: !todo.isDone,
      },
      {
        onSuccess: () => refetch(),
      }
    );
  };

  const deleteTodoMutation = trpc.deleteTodo.useMutation();
  const handleDeleteTodo = async (id: number) => {
    deleteTodoMutation.mutate(
      { id },
      {
        onSuccess: () => refetch(),
      }
    );
  };

  return (
    <div className="App">
      <h1>tRPC Client Example</h1>

      <IconButton size="small" color="primary" onClick={async () => refetch()}>
        <Refresh />
      </IconButton>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateTodo(inputNewTodo);
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
            {data &&
              data.map((todo: any) => (
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
                        onClick={async () => {
                          handleDeleteTodo(todo.id);
                        }}
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
