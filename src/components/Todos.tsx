"use client";
import { useState, useEffect } from "react";
import { useTodoStore, getTodos, createTodo, deleteTodo } from "@/store/todoStore";

const Todos = () => {
  const todos = useTodoStore((state) => state.todos);
  const [input, setInput] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  const handleCreateTodo = async () => {
    const success = await createTodo(input);
    setInput("");
  };

  return (
    <div className="flex flex-col  rounded-xl p-8 gap-2 w-full sm:w-[500px] sm:border sm:border-gray-700">
      <div className="flex flex-col gap-1">
        {todos.map((todo: any) => (
          <div
            className="rounded-lg p-3 font-medium capitalize flex  justify-between  w-full h-[50px] group cursor-pointer"
            key={todo.todoId}
          >
            {todo.content}
            <button
              className="hidden group-hover:flex items-center justify-center bg-gray-800  h-[30px] w-[30px] p-2 rounded-lg"
              onClick={() => deleteTodo(todo.todoId)}
            >
              <svg
                className="text-gray-300 w-4 h-4"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleCreateTodo()}
        className="bg-gray-800  text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        required
      />
    </div>
  );
};

export default Todos;
