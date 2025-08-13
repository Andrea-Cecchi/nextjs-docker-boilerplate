import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

interface RouteParams {
  params: Promise<{
    aic: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { aic } = await params;

    const drug = await db.drug.findUnique({
      where: { id: aic },
      include: {
        priceHistory: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!drug) {
      return NextResponse.json({ error: "Drug not found" }, { status: 404 });
    }

    return NextResponse.json({ drug });
  } catch (error) {
    console.error("Error fetching drug:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
