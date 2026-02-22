"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  getGoals,
  createActivityLog,
} from "@/services/dashboard.service";

interface Category {
  id: string;
  name: string;
}

interface Goal {
  id: string;
  title: string;
}

export default function ActivityPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [form, setForm] = useState({
    goalId: "",
    categoryId: "",
    minutes: "",
    progress: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, gls] = await Promise.all([
          getCategories(),
          getGoals(),
        ]);

        setCategories(cats);
        setGoals(gls);
      } catch {
        setError("Failed to load categories or goals.");
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await createActivityLog({
        goalId: form.goalId,
        categoryId: form.categoryId,
        minutes: Number(form.minutes),
        progress: Number(form.progress),
      });

      setSuccess("Activity logged successfully.");

setTimeout(() => {
  router.push("/dashboard");
}, 500);

      setForm({
        goalId: "",
        categoryId: "",
        minutes: "",
        progress: "",
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to log activity."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">
        Log Activity
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl bg-white p-8 rounded-xl shadow border border-neutral-200 space-y-6"
      >
        {/* Goal Select */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Goal
          </label>
          <select
            name="goalId"
            value={form.goalId}
            onChange={handleChange}
            required
            className="w-full border border-neutral-300 rounded-lg px-4 py-2"
          >
            <option value="">Select goal</option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Category
          </label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
            className="w-full border border-neutral-300 rounded-lg px-4 py-2"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Minutes */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Minutes
          </label>
          <input
            type="number"
            name="minutes"
            value={form.minutes}
            onChange={handleChange}
            required
            min={1}
            className="w-full border border-neutral-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Progress */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Progress %
          </label>
          <input
            type="number"
            name="progress"
            value={form.progress}
            onChange={handleChange}
            required
            min={0}
            max={100}
            className="w-full border border-neutral-300 rounded-lg px-4 py-2"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-neutral-800 transition disabled:opacity-50"
        >
          {loading ? "Logging..." : "Log Activity"}
        </button>
      </form>
    </div>
  );
}