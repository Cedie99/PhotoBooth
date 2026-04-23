import { NextResponse } from "next/server";
import { z } from "zod";

const eventSchema = z.object({
  slug: z.string().min(3),
  title: z.string().min(2),
  eventType: z.string().min(2),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  locationName: z.string().min(2)
});

const inMemoryEvents: Array<z.infer<typeof eventSchema>> = [];

export async function GET() {
  return NextResponse.json({ data: inMemoryEvents });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = eventSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid event payload",
        errors: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  inMemoryEvents.push(parsed.data);

  return NextResponse.json({ message: "Event created", data: parsed.data }, { status: 201 });
}
