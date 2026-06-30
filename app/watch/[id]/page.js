"use client"
// 1. Set runtime Edge untuk sinkronisasi optimal di Cloudflare
export const runtime = 'edge';

import { useEffect, useState, use } from 'react'
import { useParams, useRouter } from 'next/navigation'

// CONFIGURATION (Monetisasi & Channel Tetap Aman)
const TELEGRAM_CHANNEL = "https://t.me/+Az4uGyWA9Q5kNTI1" 
const ADSTERRA_LINK = "https://www.effectivegatecpm.com/hg27i5eg6?key=58350889f5d56c4a6e8d2eaf93afe9aa"
const SHOPEE_1 = "https://s.shopee.co.id/8zzw008PFz"
const SHOPEE_2 = "https://s.shopee.co.id/4qAUISsBIg"
const LIMIT_POPUP = 3; 

export default function WatchPage({ params }) {
  // Membuka params Next.js App Router terbaru secara aman
  const { id } = use(params)
  const router = useRouter()
  
  const [video, setVideo] = useState(null)
  const [related, setRelated] = useState([])
  const [currentUrl, setCurrentUrl] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAgePopup, setShowAgePopup] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchVideoDetail()
      fetchRelated()
      setCurrentUrl(window.location.href)
      checkPopupLimit()
    }
  }, [id])

  // 2. Mengambil detail satu video via API D1 internal
  const fetchVideoDetail = async () => {
    try {
      const response = await fetch(`/api/videos/${id}`)
      if (response.status === 200) {
        const data = await response.json()
        setVideo(data)
        if (data.title) document.title = data.title
      }
    } catch (error) {
      console.error("Gagal memuat detail video:", error)
    } finally {
      setLoading(false)
    }
  }

  // 3. Mengambil daftar video rekomendasi via API D1 internal
  const fetchRelated = async () => {
    try {
      const response = await fetch('/api/videos')
      if (response.status === 200) {
        const data = await response.json()
        if (Array.isArray(data)) {
          // Filter agar video yang sedang ditonton tidak masuk daftar rekomendasi
          setRelated(data.filter(v => v.id != id).slice(0, 12))
        }
      }
    } catch (error) {
      console.error("Gagal memuat rekomendasi:", error)
    }
  }

  const checkPopupLimit = () => {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('popup_date');
    let count = parseInt(localStorage.getItem('popup_count') || '0');
    if (lastDate !== today) {
      localStorage.setItem('popup_date', today);
      localStorage.setItem('popup_count', '0');
      count = 0;
    }
    if (count < LIMIT_POPUP) setShowAgePopup(true);
  }

  const handleCuanClick = (e) => {
    if (e) e.preventDefault();
    let sessionClicks = parseInt(sessionStorage.getItem('total_clicks') || '0');
    sessionClicks++;
    sessionStorage.setItem('total_clicks', sessionClicks);

    let targetUrl = ADSTERRA_LINK;
    if (sessionClicks > 1) {
      const links = [ADSTERRA_LINK, SHOPEE_1, SHOPEE_2];
      targetUrl = links[Math.floor(Math.random() * links.length)];
    }

    if (showAgePopup) {
      let count = parseInt(localStorage.getItem('popup_count') || '0');
      localStorage.setItem('popup_count', (count + 1).toString());
      setShowAgePopup(false);
      setTimeout(() => {
        window.open(targetUrl, '_blank');
      }, 500);
    } else {
      window.open(targetUrl, '_blank');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) router.push(`/?search=${encodeURIComponent(searchTerm)}`)
  }

  const shareTo = (platform) => {
    if (!video) return;
    const text = `Nonton ${video.title} gratis di sini! 🍿`
    const url = encodeURIComponent(currentUrl)
    let shareUrl = ""
    if (platform === 'wa') shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`
    if (platform === 'tg') shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
    if (platform === 'fb') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
    if (platform === 'copy') {
      navigator.clipboard.writeText(currentUrl)
      alert("Link disalin!")
      return
    }
    window.open(shareUrl, '_blank')
  }

  // Fungsi Sakti buat ganti domain Doodstream otomatis
  const getCleanUrl = (rawUrl) => {
    if (!rawUrl) return "";
    return rawUrl
      .replace('myvidplay.com', 'playmogo.com')
      .replace('doodstream.com', 'playmogo.com')
      .replace('dood.li', 'playmogo.com')
      .replace('dood.re', 'playmogo.com');
  }

  if (loading) return <div style={{ background: '#000', height: '100vh', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>Memuat Video...</div>

  if (!video) return <div style={{ background: '#000', height: '100vh', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>⚠️ Video tidak ditemukan atau database kosong.</div>

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* AGE POPUP (ADS TRIGGER) */}
      {showAgePopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.98)', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#111', padding: '30px', borderRadius: '15px', textAlign: 'center', maxWidth: '400px', border: '1px solid #E50914', boxShadow: '0 0 40px rgba(229, 9, 20, 0.4)' }}>
            <h2 style={{ color: '#E50914', marginBottom: '10px', textTransform: 'uppercase' }}>Konfirmasi Usia</h2>
            <p style={{ fontSize: '0.9rem', marginBottom: '25px', color: '#ccc' }}>Konten ini mengandung unsur dewasa. Anda harus berusia di atas 18 tahun untuk melanjutkan.</p>
            <button onClick={handleCuanClick} style={{ width: '100%', padding: '16px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>SAYA BERUSIA 18 TAHUN+</button>
          </div>
        </div>
      )}

      {/* STICKY NAVBAR */}
      <nav style={{ padding: '10px 5%', background: '#000', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ color: '#E50914', textDecoration: 'none', fontWeight: 'bold' }}>← BERANDA</a>
        <form onSubmit={handleSearch}>
          <input placeholder="Cari film..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ background: '#111', color: '#fff', border: '1px solid #333', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', width: '120px', outline: 'none' }} />
        </form>
      </nav>

      {/* CONTAINER CONTENT */}
      <div style={{ padding: '20px 5%', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* IFRAME PLAYER */}
        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#111', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 0 20px rgba(229, 9, 20, 0.2)' }}>
          <iframe 
            src={getCleanUrl(video.url || video.thumbnail)} // fallback jika field database berupa url langsung atau id
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} 
            allowFullScreen 
            referrerPolicy="no-referrer"
          />
        </div>

        {/* BUTTON CUAN TRICK */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <button onClick={handleCuanClick} style={{ background: 'linear-gradient(90deg, #FFD700, #FFA500)', color: '#000', textAlign: 'center', padding: '16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)', textTransform: 'uppercase' }}>
            🔥 NONTON SERVER HD (FULL SPEED)
          </button>
          <button onClick={handleCuanClick} style={{ background: '#222', color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '8px', border: '1px solid #444', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}>
            📥 DOWNLOAD FILM (MULTI RESOLUSI)
          </button>
        </div>

        {/* TG CHANNEL PROMO */}
        <div style={{ marginTop: '15px', background: 'linear-gradient(90deg, #0088cc, #00aaff)', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Update Film Terbaru?</h4>
            <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.9 }}>Join grup Telegram kita sekarang!</p>
          </div>
          <a href={TELEGRAM_CHANNEL} target="_blank" rel="noopener noreferrer" style={{ background: '#fff', color: '#0088cc', padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' }}>JOIN</a>
        </div>

        {/* INFO UTAMA */}
        <div style={{ marginTop: '20px' }}>
          <h1 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>{video.title}</h1>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button onClick={() => shareTo('wa')} style={{ background: '#25D366', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>WA</button>
            <button onClick={() => shareTo('tg')} style={{ background: '#0088cc', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Telegram</button>
            <button onClick={() => shareTo('fb')} style={{ background: '#1877F2', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Facebook</button>
            <button onClick={() => shareTo('copy')} style={{ background: '#333', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Salin Link</button>
          </div>
          <div style={{ height: '1px', background: '#222', width: '100%', marginBottom: '30px' }}></div>
        </div>

        {/* RELATED VIDEOS GRID */}
        <h3 style={{ fontSize: '1rem', color: '#E50914', marginBottom: '15px' }}>REKOMENDASI UNTUKMU</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px' }}>
          {related.map((v) => (
            <a href={`/watch/${v.id}`} key={v.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ position: 'relative', paddingTop: '145%', background: '#111', borderRadius: '8px', overflow: 'hidden', border: '1px solid #222' }}>
                {v.thumbnail && <img src={`https://images.weserv.nl/?url=${encodeURIComponent(v.thumbnail)}&w=300`} referrerPolicy="no-referrer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <p style={{ fontSize: '0.7rem', marginTop: '8px', textAlign: 'center', height: '2.4em', overflow: 'hidden' }}>{v.title}</p>
            </a>
          ))}
        </div>

      </div>
    </div>
  )
}
