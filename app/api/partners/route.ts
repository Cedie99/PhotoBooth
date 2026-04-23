import { NextResponse } from "next/server";
import { z } from "zod";

const partnerLeadSchema = z.object({
  businessName: z.string().min(2),
  contactPerson: z.string().min(2),
  email: z.string().email(),
  city: z.string().min(2),
  boothCount: z.coerce.number().int().positive().max(100)
});

const inMemoryPartnerLeads: Array<z.infer<typeof partnerLeadSchema>> = [];

export async function GET() {
  return NextResponse.json({ data: inMemoryPartnerLeads });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = partnerLeadSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid partner application payload",
        errors: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  inMemoryPartnerLeads.push(parsed.data);

  return NextResponse.json({ message: "Partner application received", data: parsed.data }, { status: 201 });
}
