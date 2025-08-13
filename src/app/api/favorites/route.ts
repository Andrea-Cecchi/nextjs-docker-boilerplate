import { NextRequest, NextResponse } from "next/server";
import { db, redisClient } from "~/server/db";
import { auth } from "~/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favorites = await db.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        drug: {
          include: {
            priceHistory: {
              orderBy: { date: "desc" },
              take: 1,
            },
          },
        },
      },
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🟢 POST /api/favorites - Starting...");

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    console.log(
      "🔐 Session check:",
      session
        ? { userId: session.user.id, email: session.user.email }
        : "NO SESSION",
    );

    if (!session) {
      console.log("❌ No session - returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { drugId } = await request.json();
    console.log("📋 Request data:", { drugId, userId: session.user.id });

    if (!drugId) {
      console.log("❌ No drugId - returning 400");
      return NextResponse.json(
        { error: "Drug ID is required" },
        { status: 400 },
      );
    }

    console.log("🗄️ Starting database upsert...");

    // Use upsert to avoid duplicate key errors
    const favorite = await db.favorite.upsert({
      where: {
        userId_drugId: {
          userId: session.user.id,
          drugId,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        drugId,
      },
    });

    console.log("✅ Database operation successful:", {
      favoriteId: favorite.id,
      userId: favorite.userId,
      drugId: favorite.drugId,
    });

    // Force cache invalidation - nuclear approach
    try {
      const allKeys = await redisClient.keys("*");
      console.log("🔍 ALL Redis keys before invalidation:", allKeys);

      if (allKeys.length > 0) {
        await redisClient.del(...allKeys);
        console.log("💥 CLEARED ALL Redis cache:", allKeys.length, "keys");
      } else {
        console.log("ℹ️ No Redis keys found");
      }
    } catch (cacheError) {
      console.warn("⚠️ Cache invalidation failed:", cacheError);
    }

    return NextResponse.json({ favorite });
  } catch (error) {
    console.error("💥 Error adding favorite:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { drugId } = await request.json();

    if (!drugId) {
      return NextResponse.json(
        { error: "Drug ID is required" },
        { status: 400 },
      );
    }

    // Use deleteMany to avoid errors if favorite doesn't exist
    const result = await db.favorite.deleteMany({
      where: {
        userId: session.user.id,
        drugId,
      },
    });

    console.log("✅ Database delete successful:", {
      deletedCount: result.count,
    });

    // Force cache invalidation - nuclear approach
    try {
      const allKeys = await redisClient.keys("*");
      console.log("🔍 ALL Redis keys before invalidation:", allKeys);

      if (allKeys.length > 0) {
        await redisClient.del(...allKeys);
        console.log("💥 CLEARED ALL Redis cache:", allKeys.length, "keys");
      } else {
        console.log("ℹ️ No Redis keys found");
      }
    } catch (cacheError) {
      console.warn("⚠️ Cache invalidation failed:", cacheError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
