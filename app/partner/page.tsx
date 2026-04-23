"use client";

import type { FormEvent } from "react";
import { useState } from "react";

export default function PartnerPage() {
  const [businessName, setBusinessName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Metro Manila");
  const [boothCount, setBoothCount] = useState(1);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          contactPerson,
          email,
          city,
          boothCount
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not submit application.");
        return;
      }

      setMessage("Application submitted. We will reach out within 24-48 hours.");
    } catch {
      setMessage("Unexpected error while submitting your application.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "56px 24px" }}>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: 12 }}>Partner Network</h1>
      <p style={{ maxWidth: 720, color: "#444", lineHeight: 1.7 }}>
        This page is where mall and event photobooth operators onboard, manage booths, and monitor revenue share.
      </p>
      <ul style={{ marginTop: 20, lineHeight: 1.9 }}>
        <li>Booth onboarding workflow with KYB/KYC checks</li>
        <li>Session-level analytics and payout tracking</li>
        <li>White-label event branding and sponsor slots</li>
        <li>Partner-specific referral links and promo codes</li>
      </ul>

      <form
        onSubmit={onSubmit}
        style={{
          marginTop: 24,
          display: "grid",
          gap: 10,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 16,
          maxWidth: 640
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22 }}>Apply as a partner</h2>

        <label>
          Business name
          <input required value={businessName} onChange={(e) => setBusinessName(e.target.value)} style={{ width: "100%", marginTop: 6, padding: 10 }} />
        </label>

        <label>
          Contact person
          <input required value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} style={{ width: "100%", marginTop: 6, padding: 10 }} />
        </label>

        <label>
          Email
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", marginTop: 6, padding: 10 }} />
        </label>

        <label>
          City
          <input required value={city} onChange={(e) => setCity(e.target.value)} style={{ width: "100%", marginTop: 6, padding: 10 }} />
        </label>

        <label>
          Number of booths
          <input
            required
            type="number"
            min={1}
            value={boothCount}
            onChange={(e) => setBoothCount(Number(e.target.value))}
            style={{ width: "100%", marginTop: 6, padding: 10 }}
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          style={{ border: "none", background: "#111", color: "#fff", borderRadius: 8, padding: "12px 14px", cursor: "pointer" }}
        >
          {submitting ? "Submitting..." : "Submit application"}
        </button>

        {message ? <p style={{ margin: 0, fontSize: 14, color: "#b42318" }}>{message}</p> : null}
      </form>
    </div>
  );
}
