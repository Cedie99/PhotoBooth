"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";

interface EventResponse {
  message: string;
  data?: {
    slug: string;
    title: string;
    eventType: string;
    startsAt: string;
    endsAt: string;
    locationName: string;
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function GetStartedPage() {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [locationName, setLocationName] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const slug = useMemo(() => slugify(title || "my-event"), [title]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title,
          eventType,
          locationName,
          startsAt: new Date(startsAt).toISOString(),
          endsAt: new Date(endsAt).toISOString()
        })
      });

      const data: EventResponse = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not create event.");
        return;
      }

      setMessage(`Event created. Public memory URL: /${data.data?.slug ?? slug}`);
    } catch {
      setMessage("Unexpected error while creating your event.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 80px" }}>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: 10 }}>Create your first event</h1>
      <p style={{ color: "#444", lineHeight: 1.7, marginBottom: 22 }}>
        This setup wizard creates your event record and reserves a memory-site slug.
      </p>

      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 12, background: "#fff", border: "1px solid #ddd", borderRadius: 12, padding: 16 }}
      >
        <label>
          Event name
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", marginTop: 6, padding: 10 }}
            placeholder="Sofia & Marco Wedding"
          />
        </label>

        <label>
          Event type
          <select value={eventType} onChange={(e) => setEventType(e.target.value)} style={{ width: "100%", marginTop: 6, padding: 10 }}>
            <option>Wedding</option>
            <option>Birthday</option>
            <option>Corporate</option>
            <option>Prom</option>
            <option>Graduation</option>
          </select>
        </label>

        <label>
          Location
          <input
            required
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            style={{ width: "100%", marginTop: 6, padding: 10 }}
            placeholder="SM North Edsa"
          />
        </label>

        <label>
          Starts at
          <input required type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} style={{ width: "100%", marginTop: 6, padding: 10 }} />
        </label>

        <label>
          Ends at
          <input required type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} style={{ width: "100%", marginTop: 6, padding: 10 }} />
        </label>

        <div style={{ fontSize: 14, color: "#666" }}>Reserved slug: /{slug || "my-event"}</div>

        <button
          type="submit"
          disabled={loading}
          style={{ border: "none", background: "#111", color: "#fff", borderRadius: 8, padding: "12px 14px", cursor: "pointer" }}
        >
          {loading ? "Creating event..." : "Create event"}
        </button>

        {message ? <p style={{ margin: 0, color: "#b42318", fontSize: 14 }}>{message}</p> : null}
      </form>
    </div>
  );
}
