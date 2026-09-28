import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const header = req.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    const db = await getDb();

    await db.collection("users").updateOne(
      { uid: decoded.uid },
      {
        $set: {
          email: decoded.email ?? null,
          name: decoded.name ?? null,
          photoURL: decoded.picture ?? null,
          lastLoginAt: new Date(),
        },
        $setOnInsert: { uid: decoded.uid, createdAt: new Date() },
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("auth sync failed:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}