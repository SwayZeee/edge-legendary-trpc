export interface Todo {
  id: number;
  title: string;
  isDone: boolean;
}

export interface TodoInput {
  title: string;
}

export interface TodoUpdate {
  title: string;
  isDone: boolean;
}
