"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import { attachAuthInterceptor } from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const { setAccessToken } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginUser(form);

      // assuming backend returns { accessToken }
      setAccessToken(data.accessToken);

      // attach interceptor AFTER token is set
      attachAuthInterceptor(() => data.accessToken);

      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Invalid credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl border border-neutral-200">
        
        <h1 className="text-3xl font-bold text-neutral-900">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Login to continue tracking your learning.
        </p>
  
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
  
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition"
            />
          </div>
  
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
  
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black py-3 text-white font-medium transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
  
        <p className="mt-6 text-sm text-neutral-500">
          Don’t have an account?{" "}
          <span
            className="cursor-pointer font-medium text-black hover:underline"
            onClick={() => router.push("/register")}
          >
            Create one
          </span>
        </p>
  
      </div>
    </div>
  );
}