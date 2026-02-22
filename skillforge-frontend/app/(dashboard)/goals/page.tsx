"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Goal {
  id: string;
  title: string;
  targetMinutes: number;
  progress: number;
  status: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [title, setTitle] = useState("");
  const [targetMinutes, setTargetMinutes] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchGoals = async () => {
    const res = await api.get("/goals");
    setGoals(res.data);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await api.post("/goals", {
      title,
      targetMinutes: Number(targetMinutes),
    });

    setTitle("");
    setTargetMinutes("");
    await fetchGoals();
    setLoading(false);
  };

  return (
    <div>

      <h1 className="text-3xl font-bold text-neutral-900 mb-8">
        Goals
      </h1>

      {/* Create Goal */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-xl shadow border border-neutral-200 mb-10 space-y-4 max-w-xl"
      >
        <input
          type="text"
          placeholder="Goal title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-neutral-300 rounded-lg px-4 py-2"
        />

        <input
          type="number"
          placeholder="Target minutes"
          value={targetMinutes}
          onChange={(e) => setTargetMinutes(e.target.value)}
          required
          className="w-full border border-neutral-300 rounded-lg px-4 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-neutral-800 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Goal"}
        </button>
      </form>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white p-6 rounded-xl shadow border border-neutral-200"
          >
            <h2 className="text-lg font-semibold text-neutral-900">
              {goal.title}
            </h2>
            <p className="text-sm text-neutral-500 mt-2">
              Target: {goal.targetMinutes.toLocaleString()} mins
            </p>
            <p className="text-sm text-neutral-500">
              Progress: {goal.progress}%
            </p>
            <p className="text-sm text-neutral-500">
              Status: {goal.status}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}