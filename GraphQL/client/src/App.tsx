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
import { gql, useMutation, useQuery } from "@apollo/client";
import "./App.css";

const GET_ALL_TODOS = gql`
  query Todos {
    todos {
      id
      title
      isDone
    }
  }
`;

const ADD_TODO = gql`
  mutation AddTodo($newTodo: TodoInput) {
    addTodo(newTodo: $newTodo) {
      id
      isDone
      title
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($updateTodoId: Int, $updateTodo: TodoUpdate) {
    updateTodo(id: $updateTodoId, updateTodo: $updateTodo) {
      id
      isDone
      title
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($deleteTodoId: Int) {
    deleteTodo(id: $deleteTodoId) {
      id
      isDone
      title
    }
  }
`;

function App() {
  const [inputNewTodo, setInputNewTodo] = useState("");

  const handleChange = (e: any) => {
    const { value } = e.target;
    setInputNewTodo(value);
  };

  interface Todo {
    id: string;
    title: string;
    isDone: boolean;
  }

  interface TodoData {
    todos: Todo[];
  }

  const { data, refetch } = useQuery<TodoData>(GET_ALL_TODOS);
  const [addTodo] = useMutation(ADD_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);

  const toggleIsDone = async (todo: any) => {
    await updateTodo({
      variables: {
        updateTodoId: todo.id,
        updateTodo: {
          isDone: !todo.isDone,
          title: todo.title,
        },
      },
    });
    await refetch();
  };

  return (
    <div className="App">
      <h1>GraphQL Todo Client Example</h1>

      <IconButton
        size="small"
        color="primary"
        onClick={async () => {
          refetch();
        }}
      >
        <Refresh />
      </IconButton>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await addTodo({ variables: { newTodo: { title: inputNewTodo } } });
          await refetch();
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
              data.todos.map((todo: any) => (
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
                        onClick={async () => {
                          await toggleIsDone(todo);
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
                        onClick={async () => {
                          await toggleIsDone(todo);
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
                          await deleteTodo({
                            variables: {
                              deleteTodoId: todo.id,
                            },
                          });
                          await refetch();
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
