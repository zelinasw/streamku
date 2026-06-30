import { NextResponse } from 'next/server';
export const runtime = 'edge';

export async function POST(request) {
  try {
    const db = process.env.DB || request.context?.env?.DB;
    const { id } = await request.json();
    await db.prepare("DELETE FROM videos WHERE id = ?").bind(id).run();
    return NextResponse.json({ status: 200, msg: "Deleted" });
  } catch (err) { return NextResponse.json({ status: 500, msg: err.message }); }
}
