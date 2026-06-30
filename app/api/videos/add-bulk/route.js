import { NextResponse } from 'next/server';
export const runtime = 'edge';

export async function POST(request) {
  try {
    const db = process.env.DB || request.context?.env?.DB;
    const { videos } = await request.json();
    
    // Gunakan transaksi batch D1 biar proses masukkin data sekaligus kencang
    const statements = videos.map(v => 
      db.prepare("INSERT INTO videos (title, url, thumbnail) VALUES (?, ?, ?)")
        .bind(v.title, v.url, v.thumbnail)
    );
    
    await db.batch(statements);
    return NextResponse.json({ status: 200, msg: "Bulk Insert Success" });
  } catch (err) { return NextResponse.json({ status: 500, msg: err.message }); }
}
