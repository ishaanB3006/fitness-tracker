"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  initPersonalize,
  getPersonalizeInstance,
  setUserAttributes,
  getExperiences,
  getVariantAliases,
  triggerPersonalizeEvent,
} from "@/lib/personalize";

export default function TestPersonalizePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "connected" | "error">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [variants, setVariants] = useState<string[]>([]);
  const [eventKey, setEventKey] = useState("clickCTA");
  const [attributeKey, setAttributeKey] = useState("age");
  const [attributeValue, setAttributeValue] = useState("25");

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev]);
  };

  const handleInit = async () => {
    setLoading(true);
    addLog("Initializing Personalize SDK...");

    try {
      const instance = await initPersonalize();
      if (instance) {
        setStatus("connected");
        addLog("✅ SDK initialized successfully!");
      } else {
        setStatus("error");
        addLog("❌ SDK initialization returned null. Check your Project UID.");
      }
    } catch (err) {
      setStatus("error");
      addLog(`❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetExperiences = () => {
    addLog("Fetching experiences...");
    const exp = getExperiences();
    setExperiences(exp);
    addLog(`📊 Found ${exp.length} experience(s)`);
  };

  const handleGetVariants = () => {
    addLog("Fetching variant aliases...");
    const vars = getVariantAliases();
    setVariants(vars);
    addLog(`🏷️ Found ${vars.length} variant alias(es)`);
  };

  const handleSetAttribute = async () => {
    addLog(`Setting attribute: ${attributeKey} = ${attributeValue}`);
    try {
      const parsedValue = isNaN(Number(attributeValue)) 
        ? attributeValue 
        : Number(attributeValue);
      await setUserAttributes({ [attributeKey]: parsedValue });
      addLog(`✅ Attribute set successfully`);
    } catch (err) {
      addLog(`❌ Error setting attribute: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  const handleTriggerEvent = async () => {
    addLog(`Triggering event: ${eventKey}`);
    try {
      await triggerPersonalizeEvent(eventKey);
      addLog(`✅ Event triggered successfully`);
    } catch (err) {
      addLog(`❌ Error triggering event: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  const handleCheckStatus = () => {
    const instance = getPersonalizeInstance();
    if (instance) {
      addLog("✅ SDK is initialized and ready");
      setStatus("connected");
    } else {
      addLog("⚠️ SDK is not initialized");
      setStatus("idle");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            Personalize SDK Test
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                status === "connected"
                  ? "bg-green-500"
                  : status === "error"
                  ? "bg-red-500"
                  : "bg-gray-400"
              }`}
            />
            <span className="text-sm font-normal text-gray-500">
              {status === "connected"
                ? "Connected"
                : status === "error"
                ? "Error"
                : "Not initialized"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleInit} disabled={loading}>
              {loading ? "Initializing..." : "Initialize SDK"}
            </Button>
            <Button variant="outline" onClick={handleCheckStatus}>
              Check Status
            </Button>
          </div>

          <p className="text-sm text-gray-500">
            Make sure <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">NEXT_PUBLIC_PERSONALIZE_PROJECT_UID</code> is set in your environment.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Experiences & Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGetExperiences} disabled={status !== "connected"}>
              Get Experiences
            </Button>
            <Button variant="outline" onClick={handleGetVariants} disabled={status !== "connected"}>
              Get Variant Aliases
            </Button>
          </div>

          {experiences.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Experiences:</h4>
              <pre className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md overflow-auto text-sm">
                {JSON.stringify(experiences, null, 2)}
              </pre>
            </div>
          )}

          {variants.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Variant Aliases:</h4>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <span key={v} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Attributes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-end">
            <div className="space-y-1">
              <label className="text-sm font-medium">Key</label>
              <input
                type="text"
                value={attributeKey}
                onChange={(e) => setAttributeKey(e.target.value)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                placeholder="Key"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Value</label>
              <input
                type="text"
                value={attributeValue}
                onChange={(e) => setAttributeValue(e.target.value)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                placeholder="Value"
              />
            </div>
            <Button onClick={handleSetAttribute} disabled={status !== "connected"}>
              Set Attribute
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trigger Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-end">
            <div className="space-y-1 flex-1">
              <label className="text-sm font-medium">Event Key</label>
              <input
                type="text"
                value={eventKey}
                onChange={(e) => setEventKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                placeholder="Event key (e.g., clickCTA)"
              />
            </div>
            <Button onClick={handleTriggerEvent} disabled={status !== "connected"}>
              Trigger Event
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 overflow-auto bg-gray-50 dark:bg-gray-900 rounded-md p-3 font-mono text-sm space-y-1">
            {logs.length === 0 ? (
              <p className="text-gray-400">No activity yet. Initialize the SDK to start.</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-gray-700 dark:text-gray-300">
                  {log}
                </div>
              ))
            )}
          </div>
          {logs.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => setLogs([])}
            >
              Clear Logs
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

