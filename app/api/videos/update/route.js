import { NextResponse } from 'next/server';
export const runtime = 'edge';

export async function POST(request) {
  try {
    const db = process.env.DB || request.context?.env?.DB;
    const { id, title, url, thumbnail } = await request.json();
    await db.prepare("UPDATE videos SET title = ?, url = ?, thumbnail = ? WHERE id = ?").bind(title, url, thumbnail, id).run();
    return NextResponse.json({ status: 200, msg: "Updated" });
  } catch (err) { return NextResponse.json({ status: 500, msg: err.message }); }
}
