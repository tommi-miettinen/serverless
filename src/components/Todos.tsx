"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const Todos = () => {
  const [todos, setTodos] = useState<any>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const result = await axios.get("/api/todos");
      setTodos(result.data);
    } catch (err) {}
  };

  const createTodo = async () => {
    try {
      const result = await axios.post("/api/todos", { content: input });
      setTodos((todos: any) => [...todos, result.data]);
      setInput("");
    } catch (err) {}
  };

  const deleteTodo = async (todoId: string) => {
    try {
      await axios.delete(`/api/todos/${todoId}`);
      setTodos((todos: any) => todos.filter((t: any) => t.todoId !== todoId));
    } catch (err) {}
  };

  return (
    <div>
      <div className="flex flex-col p-4 w-full border">
        {todos.map((todo: any) => (
          <div key={todo.todoId}>
            {todo.content} <button onClick={() => deleteTodo(todo.todoId)}>x</button>
          </div>
        ))}

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createTodo()}
          className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>
    </div>
  );
};

export default Todos;
