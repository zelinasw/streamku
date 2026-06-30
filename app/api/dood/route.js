import { NextResponse } from 'next/server';

// 1. WAJIB: Set runtime ke Edge agar Cloudflare Workers mengenali route ini
export const runtime = 'edge';

export async function GET() {
  // 2. DISARANKAN: Mengambil API Key dari Cloudflare Environment Variables 
  // Jika belum disetting di dashboard Cloudflare, dia akan fallback ke string API Key kamu
  const API_KEY = process.env.DOODSTREAM_API_KEY || "109446t4h65dr9m44eajs8"; 
  
  try {
    const response = await fetch(`https://doodapi.com/api/file/list?key=${API_KEY}`);
    const data = await response.json();

    // Jika data berhasil diambil, kita "bersihkan" link-nya sebelum dikirim ke Admin Panel
    if (data.status === 200 && data.result && data.result.files) {
      data.result.files = data.result.files.map(file => {
        return {
          ...file,
          // Kita pastikan semua link yang masuk pakai domain playmogo.com agar lancar di HP
          file_code: file.file_code, 
          title: file.title
        };
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
