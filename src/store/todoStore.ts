import { create } from "zustand";
import axios from "axios";
import { Todo } from "@/types";

interface TodoState {
  todos: Todo[];
}

export const useTodoStore = create<TodoState>(() => ({
  todos: [],
}));

export const createTodo = async (content: string) => {
  try {
    const result = await axios.post("/api/todos", { content });
    useTodoStore.setState({ todos: [...useTodoStore.getState().todos, result.data] });
  } catch (err) {}
};

export const deleteTodo = async (todoId: string) => {
  try {
    await axios.delete(`/api/todos/${todoId}`);
    useTodoStore.setState({ todos: useTodoStore.getState().todos.filter((t: any) => t.todoId !== todoId) });
  } catch (err) {}
};

export const getTodos = async () => {
  try {
    const result = await axios.get("/api/todos");
    useTodoStore.setState({ todos: result.data });
  } catch (err) {}
};
