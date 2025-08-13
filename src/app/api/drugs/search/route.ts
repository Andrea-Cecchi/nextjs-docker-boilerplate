import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const whereCondition = q
      ? {
          OR: [
            { brandName: { contains: q, mode: "insensitive" as const } },
            { activeSubstance: { contains: q, mode: "insensitive" as const } },
            { id: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [drugs, total] = await Promise.all([
      db.drug.findMany({
        where: whereCondition,
        include: {
          priceHistory: {
            orderBy: { date: "desc" },
            take: 1,
          },
        },
        skip,
        take: limit,
        orderBy: { brandName: "asc" },
      }),
      db.drug.count({ where: whereCondition }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      drugs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error searching drugs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
