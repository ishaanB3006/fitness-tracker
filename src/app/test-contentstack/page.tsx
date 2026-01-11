"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEntry, getAllSupplements } from "@/lib/contentstack";

export default function TestContentstackPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [entryId, setEntryId] = useState("blt34dfb57eaeb74da3");
  const [testType, setTestType] = useState<"entry" | "supplements">("entry");

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      if (testType === "supplements") {
        const result = await getAllSupplements();
        setData(result);
      } else {
        const result = await getEntry(entryId);
        setData(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Contentstack Entry Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Test Type:</label>
            <div className="flex gap-2">
              <Button
                variant={testType === "entry" ? "default" : "outline"}
                onClick={() => setTestType("entry")}
              >
                Single Entry
              </Button>
              <Button
                variant={testType === "supplements" ? "default" : "outline"}
                onClick={() => setTestType("supplements")}
              >
                Supplements
              </Button>
            </div>
          </div>

          {testType === "entry" && (
            <div className="space-y-2">
              <label htmlFor="entryId" className="text-sm font-medium">
                Entry ID:
              </label>
              <input
                id="entryId"
                type="text"
                value={entryId}
                onChange={(e) => setEntryId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                placeholder="Enter entry ID"
              />
            </div>
          )}

          <Button onClick={handleFetch} disabled={loading || (testType === "entry" && !entryId)}>
            {loading ? "Fetching..." : testType === "supplements" ? "Fetch Supplements" : "Fetch Entry"}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-800 dark:text-red-200 font-medium">Error:</p>
              <p className="text-red-600 dark:text-red-300">{error}</p>
            </div>
          )}

          {data && (
            <div className="space-y-2">
              <h3 className="font-semibold">Response:</h3>
              <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md overflow-auto text-sm">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

