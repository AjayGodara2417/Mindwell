"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Assessment = {
  score: number;
  percentage: number;
  severity: string;
  created_at: string;
};

export default function PatientDetails() {
  const { email } = useParams();
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    const fetchAssessments = async () => {
      const res = await fetch(`/api/assessment?email=${email}`);
      const data = await res.json();

      if (data.success) {
        setAssessments(data.history);
      }
    };

    fetchAssessments();
  }, [email]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Patient Assessments
      </h1>

      <table className="w-full bg-white shadow rounded-xl">
        <thead>
          <tr className="border-b text-gray-500 text-sm">
            <th className="p-3">Score</th>
            <th>Percentage</th>
            <th>Severity</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {assessments.map((a: Assessment, i) => (
            <tr key={i} className="border-b">
              <td className="p-3">{a.score}</td>
              <td>{a.percentage}%</td>
              <td>{a.severity}</td>
              <td>
                {new Date(a.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}