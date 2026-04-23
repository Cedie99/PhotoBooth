import { notFound } from "next/navigation";
import { findSiteBySlug } from "../../lib/sampleData";

interface MemoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function MemorySitePage({ params }: MemoryPageProps) {
  const { slug } = await params;
  const site = findSiteBySlug(slug);

  if (!site) {
    notFound();
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "40px 24px 64px" }}>
      <header style={{ marginBottom: 28 }}>
        <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.08em", color: "#666", textTransform: "uppercase" }}>
          photobooth.ph/{site.slug}
        </p>
        <h1 style={{ margin: "8px 0", fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>{site.title}</h1>
        <p style={{ color: "#444", lineHeight: 1.7 }}>{site.description}</p>
      </header>

      <section style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
        <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, background: "#fff" }}>
          <strong>{site.photoCount}</strong>
          <p style={{ margin: "6px 0 0", color: "#555" }}>Photos</p>
        </div>
        <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, background: "#fff" }}>
          <strong>{site.guestCount}</strong>
          <p style={{ margin: "6px 0 0", color: "#555" }}>Guests</p>
        </div>
        <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, background: "#fff" }}>
          <strong>{site.eventType}</strong>
          <p style={{ margin: "6px 0 0", color: "#555" }}>Event type</p>
        </div>
      </section>

      <section
        style={{
          marginTop: 30,
          border: "1px dashed #aaa",
          borderRadius: 12,
          padding: 20,
          background: "#fff"
        }}
      >
        <h2 style={{ marginTop: 0 }}>Ad slot placeholder</h2>
        <p style={{ marginBottom: 0, color: "#555" }}>
          This block can be replaced by in-feed or display ad units to monetize high-traffic public memory pages.
        </p>
      </section>
    </div>
  );
}
