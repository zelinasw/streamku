import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const db = process.env.DB || request.context?.env?.DB;
    if (!db) {
      return NextResponse.json({ status: 500, msg: "Database binding 'DB' tidak ditemukan." });
    }

    const { title, thumbnail, url } = await request.json();

    if (!title || (!thumbnail && !url)) {
      return NextResponse.json({ status: 400, msg: "Data tidak lengkap." });
    }

    // Insert data film baru ke tabel D1
    await db.prepare(
      "INSERT INTO videos (title, thumbnail, url) VALUES (?, ?, ?)"
    ).bind(title, thumbnail || url, url || thumbnail).run();

    return NextResponse.json({ status: 200, msg: "Film berhasil ditambahkan!" });
  } catch (error) {
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
