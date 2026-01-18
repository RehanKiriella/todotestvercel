"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AddTodo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title, description, status: "in_progress" }),
    });

    if (response.ok) {
      setTitle("");
      setDescription("");
      router.refresh(); // This updates the TodoTable automatically
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8 p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold">Add New Task</h2>
      <input
        className="border p-2 rounded text-black"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="border p-2 rounded text-black"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit" className="bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">
        Add Todo
      </button>
    </form>
  );
}