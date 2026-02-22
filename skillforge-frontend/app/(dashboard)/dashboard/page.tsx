"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  getWeeklySummary,
  WeeklySummaryResponse,
} from "@/services/dashboard.service";
import CategoryChart from "@/components/charts/CategoryChart";

export default function DashboardPage() {
  const { accessToken, loading } = useAuth();
  const router = useRouter();

  const today = new Date();
  const defaultEnd = today.toISOString().split("T")[0];
  const defaultStart = new Date(
    today.setDate(today.getDate() - 6)
  )
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const [data, setData] = useState<WeeklySummaryResponse | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !accessToken) {
      router.push("/login");
    }
  }, [accessToken, loading, router]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const response = await getWeeklySummary(startDate, endDate);
      setData(response);
      setError(null);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to load dashboard."
      );
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  if (loading || loadingData) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-40 bg-neutral-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-neutral-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-neutral-900">
          Dashboard
        </h1>
      </div>

      {/* Date Selector */}
      <div className="flex flex-wrap items-end gap-4 mb-10 bg-white p-6 rounded-xl shadow border border-neutral-200">

        <div>
          <label className="block text-sm text-neutral-600 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-600 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-neutral-300 rounded-lg px-3 py-2"
          />
        </div>

        <button
          onClick={fetchData}
          disabled={loadingData}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-neutral-800 transition disabled:opacity-50"
        >
          {loadingData ? "Loading..." : "Apply"}
        </button>

      </div>

      {/* Error */}
      {error && (
        <p className="text-red-600 mb-6">{error}</p>
      )}

      {/* Stats */}
      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard title="Total Minutes" value={data.totalMinutes} />
            <StatCard title="Total Progress" value={`${data.totalProgress}%`} />
            <StatCard title="Active Goals" value={data.activeGoals} />
            <StatCard title="Completed Goals" value={data.completedGoals} />
          </div>

          <div>
            {data.categoryBreakdown.length > 0 ? (
              <CategoryChart data={data.categoryBreakdown} />
            ) : (
              <EmptyState />
            )}
          </div>
        </>
      )}

    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow border border-neutral-200">
      <p className="text-sm text-neutral-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-neutral-900">
        {typeof value === "number"
          ? value.toLocaleString()
          : value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl bg-white p-12 text-center shadow border border-neutral-200">
      <p className="text-neutral-500">
        No activity recorded for selected range.
      </p>
    </div>
  );
}