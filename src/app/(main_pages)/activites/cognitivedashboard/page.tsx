"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

/* ---------------- TYPES ---------------- */

type TestType =
  | "digit_span"
  | "word_recall"
  | "visual_memory"
  | "negative_bias_recall"
  | "stroop"
  | "emotional_stroop"
  | "cpt"
  | "reaction_time"
  | "symbol_digit"
  | "n_back"
  | "trail_making";

type Domain = "memory" | "attention" | "speed" | "executive";

type Cognitive = {
  test_type: TestType;
  score: number;
  created_at: string;
};

/* ---------------- HELPERS ---------------- */

const formatDate = (v: string) => new Date(v).toLocaleDateString();

const inRange = (dateStr: string, from?: string, to?: string) => {
  const d = new Date(dateStr).getTime();
  const f = from ? new Date(from).getTime() : -Infinity;
  const t = to ? new Date(to).getTime() : Infinity;
  return d >= f && d <= t;
};

const domainMap: Record<Domain, TestType[]> = {
  memory: ["digit_span", "word_recall", "visual_memory", "negative_bias_recall"],
  attention: ["stroop", "emotional_stroop", "cpt"],
  speed: ["reaction_time", "symbol_digit"],
  executive: ["n_back", "trail_making"],
};

function avg(arr: number[]) {
  return arr.length
    ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
    : 0;
}

/* ---------------- COMPONENT ---------------- */

export default function CognitiveDashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const [compareEmail, setCompareEmail] = useState("");

  const [allData, setAllData] = useState<Cognitive[]>([]);
  const [compareData, setCompareData] = useState<Cognitive[]>([]);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [domainFilter, setDomainFilter] = useState<"all" | Domain>("all");

  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH ---------------- */

  const fetchData = async (
    em: string,
    setter: (d: Cognitive[]) => void
  ) => {
    try {
      const res = await fetch(`/api/get-cognitive-data?email=${em}`);
      const result = await res.json();
      setter(Array.isArray(result.tests) ? result.tests : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setter([]);
    }
  };

  useEffect(() => {
    const e = localStorage.getItem("userEmail");
    setEmail(e);

    if (e) {
      fetchData(e, (data) => {
        setAllData(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  /* ---------------- FILTER ---------------- */

  const applyFilters = (data: Cognitive[]) => {
    return data
      .filter((t) => inRange(t.created_at, from || undefined, to || undefined))
      .filter((t) => {
        if (domainFilter === "all") return true;
        return domainMap[domainFilter].includes(t.test_type);
      });
  };

  const filtered = useMemo(
    () => applyFilters(allData),
    [allData, from, to, domainFilter]
  );

  const filteredCompare = useMemo(
    () => applyFilters(compareData),
    [compareData, from, to, domainFilter]
  );

  /* ---------------- DOMAIN SCORES ---------------- */

  const domainScores = useMemo(() => {
    const res: Record<Domain, number> = {
      memory: 0,
      attention: 0,
      speed: 0,
      executive: 0,
    };

    (Object.keys(domainMap) as Domain[]).forEach((k) => {
      const vals = filtered
        .filter((t) => domainMap[k].includes(t.test_type))
        .map((t) => t.score);

      res[k] = avg(vals);
    });

    return res;
  }, [filtered]);

  const compareDomainScores = useMemo(() => {
    const res: Record<Domain, number> = {
      memory: 0,
      attention: 0,
      speed: 0,
      executive: 0,
    };

    (Object.keys(domainMap) as Domain[]).forEach((k) => {
      const vals = filteredCompare
        .filter((t) => domainMap[k].includes(t.test_type))
        .map((t) => t.score);

      res[k] = avg(vals);
    });

    return res;
  }, [filteredCompare]);

  /* ---------------- CHART DATA ---------------- */

  const trendData = filtered.map((t, i) => ({
    ...t,
    created_at_fmt: formatDate(t.created_at),
    index: i,
  }));

  const trendCompare = filteredCompare.map((t, i) => ({
    ...t,
    created_at_fmt: formatDate(t.created_at),
    index: i,
  }));

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading cognitive data...
      </div>
    );
  }

  return (
    <div className="bg-[#f6f9f8] min-h-screen">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-[#2f5d50] mb-6">
          Cognitive Dashboard
        </h1>

        {/* FILTERS */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 grid md:grid-cols-4 gap-4">

          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border p-2 rounded" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border p-2 rounded" />

          <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value as any)} className="border p-2 rounded">
            <option value="all">All</option>
            <option value="memory">Memory</option>
            <option value="attention">Attention</option>
            <option value="speed">Speed</option>
            <option value="executive">Executive</option>
          </select>

          <div className="flex gap-2">
            <input
              value={compareEmail}
              onChange={(e) => setCompareEmail(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Compare email"
            />
            <button
              onClick={() => compareEmail && fetchData(compareEmail, setCompareData)}
              className="bg-[#2f5d50] text-white px-3 rounded"
            >
              Load
            </button>
          </div>
        </div>

        {/* DOMAIN CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(Object.keys(domainScores) as Domain[]).map((k) => (
            <div key={k} className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-400 uppercase">{k}</p>
              <h2 className="text-2xl font-bold text-[#2f5d50] mt-2">
                {domainScores[k]}
              </h2>
              {compareData.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  Compare: {compareDomainScores[k]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* TREND CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Performance Trend
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="created_at_fmt" />
              <YAxis />
              <Tooltip />

              <Line dataKey="score" type="monotone" stroke="#2f5d50" />

              {compareData.length > 0 && (
                <Line
                  data={trendCompare}
                  dataKey="score"
                  stroke="#8884d8"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Domain Breakdown
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: "Memory", you: domainScores.memory, compare: compareDomainScores.memory },
                { name: "Attention", you: domainScores.attention, compare: compareDomainScores.attention },
                { name: "Speed", you: domainScores.speed, compare: compareDomainScores.speed },
                { name: "Executive", you: domainScores.executive, compare: compareDomainScores.executive },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="you" fill="#2f5d50" />
              {compareData.length > 0 && (
                <Bar dataKey="compare" fill="#8884d8" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}