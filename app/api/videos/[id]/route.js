import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const db = process.env.DB || request.context?.env?.DB;

    if (!db) {
      return NextResponse.json({ status: 500, msg: "Database binding 'DB' tidak ditemukan." });
    }

    // Ambil data satu video yang id-nya cocok
    const video = await db.prepare("SELECT * FROM videos WHERE id = ?").bind(id).first();

    if (!video) {
      return NextResponse.json({ status: 404, msg: "Video tidak ditemukan." });
    }

    return NextResponse.json(video);
  } catch (error) {
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
