import { create } from "zustand";
import axios from "axios";
import { Todo } from "@/types";
import { v4 as uuid } from "uuid";
import { getUserId } from "./userStore";

interface TodoState {
  fetching: boolean;
  todos: Todo[];
  editingTodoId: string;
}

export const useTodoStore = create<TodoState>(() => ({
  fetching: false,
  todos: [],
  editingTodoId: "",
}));

export const createTodo = async (content: string) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error("UserId missing");

    const result = await axios.post("/api/todos", { todoId: uuid(), content, completed: false });
    useTodoStore.setState({ todos: [...useTodoStore.getState().todos, result.data] });
  } catch (err) {
    console.log(err);
  }
};

export const deleteTodo = async (todoId: string) => {
  try {
    await axios.delete(`/api/todos/${todoId}`);
    useTodoStore.setState({ todos: useTodoStore.getState().todos.filter((t: any) => t.todoId !== todoId) });
  } catch (err) {}
};

export const getTodos = async () => {
  useTodoStore.setState({ fetching: true });
  try {
    const result = await axios.get("/api/todos");

    useTodoStore.setState({ todos: result.data });
    useTodoStore.setState({ fetching: false });
  } catch (err) {
    useTodoStore.setState({ fetching: false });
  }
};

export const setEditingTodoId = (todoId: string) => useTodoStore.setState({ editingTodoId: todoId });

export const editTodo = async (todo: Todo) => {
  try {
    await axios.patch(`/api/todos/${todo.todoId}`, todo);

    useTodoStore.setState({ todos: useTodoStore.getState().todos.map((t) => (t.todoId === todo.todoId ? todo : t)) });
  } catch (err) {
    console.log(err);
  }
};
