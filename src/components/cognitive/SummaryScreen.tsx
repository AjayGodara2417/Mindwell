"use client";

import { useEffect, useState } from "react";

export default function SummaryScreen({ results }: { results: any }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sendData = async () => {
      await fetch("/api/cognitive/full", {
        method: "POST",
        body: JSON.stringify({
          patient_id: Number(localStorage.getItem("patientId")),
          results,
        }),
      });

      setLoading(false);
    };

    sendData();
  }, []);

  return (
    <div className="text-center">
      <h2 className="text-xl mb-4">Final Results</h2>

      {loading ? (
        <p>Saving results...</p>
      ) : (
        <div>
          <pre className="text-left bg-gray-100 p-4 rounded">
            {JSON.stringify(results, null, 2)}
          </pre>

          <p className="mt-4 text-green-600">Saved successfully ✅</p>
        </div>
      )}
    </div>
  );
}