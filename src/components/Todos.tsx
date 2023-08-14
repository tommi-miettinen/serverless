"use client";
import { useState, useEffect, useRef } from "react";
import { useTodoStore, getTodos, createTodo, deleteTodo, setEditingTodoId, editTodo } from "@/store/todoStore";
import { Todo } from "@/types";

const Todo = ({ todo }: { todo: Todo }) => {
  const editingTodoId = useTodoStore((state) => state.editingTodoId);
  const isEditing = todo.todoId === editingTodoId;
  const labelRef = useRef(null);

  useEffect(() => {
    if (!labelRef.current || !isEditing) return;

    const range = document.createRange();
    range.selectNodeContents(labelRef.current);
    const sel = window.getSelection();

    sel?.removeAllRanges();
    sel?.addRange(range);
  }, [isEditing]);

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setEditingTodoId("");
      //@ts-ignore
      editTodo({ ...todo, content: e.target.textContent || "" });
    }
  };

  const handleContentChange = (e: React.FocusEvent<HTMLLabelElement>) => {
    setEditingTodoId("");
    editTodo({ ...todo, content: e.target.textContent || "" });
  };

  return (
    <div className="rounded-lg p-3 font-medium capitalize flex w-full h-[50px] group cursor-pointer" key={todo.todoId}>
      <div className="flex items-center mr-4 w-full">
        <input
          onClick={() => editTodo({ ...todo, completed: !todo.completed })}
          id={todo.todoId}
          type="checkbox"
          checked={todo.completed}
          className="w-5 h-5 text-indigo-400 rounded bg-transparent"
        />
        {isEditing ? (
          <label
            onBlur={handleContentChange}
            onKeyDown={handleEnterKeyDown}
            ref={labelRef}
            contentEditable={true}
            className={`w-full cursor-pointer ml-2 text-base text-white`}
          >
            {todo.content}
          </label>
        ) : (
          <label
            onClick={() => editTodo({ ...todo, completed: !todo.completed })}
            htmlFor={todo.todoId}
            className={`w-full cursor-pointer ml-2 text-base text-white`}
          >
            {todo.content}
          </label>
        )}
      </div>

      <button
        className="sm:hidden group-hover:flex items-center justify-center hover:bg-gray-800  h-[30px] w-[30px] p-2 rounded-lg ml-auto"
        onClick={() => setEditingTodoId(todo.todoId)}
      >
        <svg
          aria-hidden="true"
          fill="currentColor"
          className="text-gray-300 w-4 h-4"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
        </svg>
      </button>
      <button
        className="sm:hidden group-hover:flex items-center justify-center hover:bg-gray-800   h-[30px] w-[30px] p-2 rounded-lg ml-2"
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
  );
};

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
    <div className="flex flex-col bg-black rounded-xl h-full sm:border-zinc-700 sm:border sm:h-[600px] overflow-auto gap-2 p-4 sm:p-8 w-full sm:w-[500px]  ">
      <div className=" scrollbar-thumb-indigo-400 scrollbar-thin flex flex-col gap-1 overflow-auto">
        {todos.map((todo) => (
          <Todo key={todo.todoId} todo={todo} />
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleCreateTodo()}
        className="bg-zinc-950 border-zinc-600 border  text-white text-sm rounded-lg block w-full p-2.5 mt-auto"
        required
      />
    </div>
  );
};

export default Todos;
