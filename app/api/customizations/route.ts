import { NextResponse } from "next/server";
import { z } from "zod";

const customizationSchema = z.object({
  sessionId: z.string().min(6),
  layout: z.enum(["strip-4", "grid-2x2", "strip-3", "grid-3x3"]),
  frame: z.string().min(2),
  filter: z.string().min(2),
  stickers: z.array(z.string()),
  textOverlay: z.string().max(80)
});

const inMemoryCustomizations: Array<z.infer<typeof customizationSchema>> = [];

export async function GET() {
  return NextResponse.json({ data: inMemoryCustomizations });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = customizationSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid customization payload",
        errors: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  inMemoryCustomizations.push(parsed.data);

  return NextResponse.json({ message: "Customization saved", data: parsed.data }, { status: 201 });
}
