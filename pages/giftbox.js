// pages/giftbox.js
// Gift Box Builder — drag & drop customizer → screenshot → order form
// Place this file at: pages/giftbox.js

import { useState, useRef, useCallback } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CATALOGUE = {
  products: [
    { id: "saffron_red",  label: "Saffron Đỏ",   emoji: "🫙", desc: "Saffron ngâm mật ong" },
    { id: "saffron_gold", label: "Saffron Vàng",  emoji: "🍯", desc: "Saffron nguyên chất" },
    { id: "honey_jar",    label: "Mật Ong",       emoji: "🍶", desc: "Mật ong hoa rừng" },
  ],
  flowers: [
    { id: "rose_red",    label: "Hồng Đỏ",        emoji: "🌹" },
    { id: "orchid",      label: "Lan Trắng",      emoji: "🌼" },
    { id: "lavender",    label: "Oải Hương",      emoji: "💜" },
  ],
  decorations: [
    { id: "ribbon_red",   label: "Ruy Băng Đỏ",  emoji: "🎀" },
    { id: "ribbon_gold",  label: "Ruy Băng Vàng", emoji: "✨" },
    { id: "pearl_chain",  label: "Chuỗi Ngọc",   emoji: "📿" },
    { id: "gold_frame",   label: "Khung Vàng",   emoji: "🖼️" },
    { id: "message_card", label: "Thiệp",        emoji: "💌" },
    { id: "crystal",      label: "Đá Pha Lê",    emoji: "💎" },
  ],
};

const BOXES = [
  { id: "box_wood",  label: "Hộp Gỗ",   bg: "linear-gradient(135deg,#d4a96a,#b8860b)", border: "#8B6914", textColor: "#4a2c2a" },
  { id: "box_white", label: "Hộp Trắng",    bg: "linear-gradient(135deg,#fdfcfb,#ede8e3)", border: "#c9b99a", textColor: "#4a2c2a" },
  { id: "box_red",   label: "Hộp Đỏ Nhung",   bg: "linear-gradient(135deg,#c0392b,#922b21)", border: "#641e16", textColor: "#fff" },
  { id: "box_pink",  label: "Hộp Hồng",    bg: "linear-gradient(135deg,#ffeef8,#f8bbd9)", border: "#e91e8c", textColor: "#4a2c2a" },
];

const PRESETS = [
  {
    name: "Lãng Mạn Đỏ", desc: "Hoàn hảo cho người yêu", emoji: "❤️", box: "box_red",
    items: [
      { id:"saffron_red",x:30,y:40 },{ id:"rose_red",x:58,y:25 },{ id:"rose_red",x:63,y:58 },
      { id:"orchid",x:50,y:18 },{ id:"ribbon_red",x:18,y:20 },{ id:"pearl_chain",x:40,y:15 },{ id:"message_card",x:15,y:62 },
    ],
  },
  {
    name: "Thanh Lịch Hồng", desc: "Nhẹ nhàng & tinh tế", emoji: "🌸", box: "box_pink",
    items: [
      { id:"saffron_gold",x:28,y:40 },{ id:"rose_pink",x:58,y:25 },{ id:"rose_white",x:60,y:58 },
      { id:"baby_breath",x:48,y:15 },{ id:"ribbon_gold",x:18,y:18 },{ id:"crystal",x:68,y:72 },{ id:"gold_frame",x:15,y:58 },
    ],
  },
  {
    name: "Quà Gỗ Tự Nhiên", desc: "Mộc mạc & ấm áp", emoji: "🌿", box: "box_wood",
    items: [
      { id:"honey_jar",x:25,y:38 },{ id:"saffron_gold",x:48,y:40 },{ id:"rose_pink",x:63,y:28 },
      { id:"lavender",x:60,y:60 },{ id:"baby_breath",x:40,y:18 },{ id:"ribbon_gold",x:18,y:58 },{ id:"message_card",x:15,y:22 },
    ],
  },
];

const CATEGORY_LABELS = { products: "Sản Phẩm", flowers: "Hoa", decorations: "Trang Trí" };

function findItem(id) {
  for (const group of Object.values(CATALOGUE)) {
    const f = group.find((i) => i.id === id);
    if (f) return f;
  }
  return null;
}

// ─── DRAGGABLE CANVAS ITEM ────────────────────────────────────────────────────
function CanvasItem({ item, selected, onSelect, onMove, onDelete, canvasRef }) {
  const info = findItem(item.catalogId);
  const drag = useRef(null);

  const startDrag = (clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    drag.current = { startX: clientX, startY: clientY, origX: item.x, origY: item.y, W: rect.width, H: rect.height };
  };

  const onMouseDown = (e) => {
    e.stopPropagation();
    onSelect(item.uid);
    startDrag(e.clientX, e.clientY);
    const mm = (me) => {
      const { startX, startY, origX, origY, W, H } = drag.current;
      onMove(item.uid, Math.max(3, Math.min(90, origX + ((me.clientX - startX) / W) * 100)), Math.max(3, Math.min(90, origY + ((me.clientY - startY) / H) * 100)));
    };
    const mu = () => { window.removeEventListener("mousemove", mm); window.removeEventListener("mouseup", mu); };
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
  };

  const onTouchStart = (e) => {
    e.stopPropagation();
    onSelect(item.uid);
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
    const tm = (te) => {
      const tt = te.touches[0];
      const { startX, startY, origX, origY, W, H } = drag.current;
      onMove(item.uid, Math.max(3, Math.min(90, origX + ((tt.clientX - startX) / W) * 100)), Math.max(3, Math.min(90, origY + ((tt.clientY - startY) / H) * 100)));
    };
    const te = () => { window.removeEventListener("touchmove", tm); window.removeEventListener("touchend", te); };
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("touchend", te);
  };

  return (
    <div
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{
        position: "absolute", left: `${item.x}%`, top: `${item.y}%`,
        transform: "translate(-50%,-50%)", cursor: selected ? "grabbing" : "grab",
        userSelect: "none", zIndex: selected ? 30 : 10,
        filter: selected ? "drop-shadow(0 0 10px rgba(233,30,140,0.9))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
        transition: "filter 0.15s",
      }}
    >
      <span style={{ fontSize: "clamp(26px, 4vw, 44px)", lineHeight: 1, display: "block" }}>{info?.emoji || "❓"}</span>
      {selected && (
        <button onMouseDown={(e) => { e.stopPropagation(); onDelete(item.uid); }}
          style={{ position: "absolute", top: -10, right: -10, background: "#e63946", border: "2px solid #fff", borderRadius: "50%", width: 22, height: 22, color: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}>
          ✕
        </button>
      )}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function GiftboxPage() {
  const [boxId, setBoxId]         = useState("box_wood");
  const [items, setItems]         = useState([]);
  const [selId, setSelId]         = useState(null);
  const [category, setCategory]   = useState("flowers");
  const [phase, setPhase]         = useState("build"); // build | confirm | done
  const [previewUrl, setPreviewUrl] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [form, setForm]           = useState({ name:"", phone:"", address:"", message:"", note:"" });
  const [sending, setSending]     = useState(false);
  const [sendErr, setSendErr]     = useState(false);

  const canvasRef = useRef(null);
  const uidRef    = useRef(0);

  const box = BOXES.find((b) => b.id === boxId);

  const addItem = useCallback((catalogId) => {
    uidRef.current++;
    setItems((p) => [...p, { uid: `u${uidRef.current}`, catalogId, x: 28 + Math.random() * 44, y: 22 + Math.random() * 52 }]);
  }, []);

  const moveItem  = useCallback((uid, x, y) => setItems((p) => p.map((i) => i.uid === uid ? { ...i, x, y } : i)), []);
  const deleteItem = useCallback((uid) => { setItems((p) => p.filter((i) => i.uid !== uid)); setSelId(null); }, []);

  const loadPreset = (preset) => {
    setBoxId(preset.box);
    uidRef.current = preset.items.length;
    setItems(preset.items.map((it, i) => ({ uid: `u${i + 1}`, catalogId: it.id, x: it.x, y: it.y })));
    setShowPresets(false);
  };

  // ── capture & go to confirm ──
  const handleSave = async () => {
    if (items.length === 0) { alert("Hãy thêm ít nhất một món vào hộp quà nhé! 🎁"); return; }
    setCapturing(true);
    try {
      const h2c = (await import("html2canvas")).default;
      const canvas = await h2c(canvasRef.current, { backgroundColor: null, useCORS: true, scale: 2, logging: false });
      setPreviewUrl(canvas.toDataURL("image/png"));
    } catch {
      // Fallback SVG snapshot
      const el = canvasRef.current;
      if (el) {
        const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="${box?.border || '#c9b99a'}"/><text x="200" y="160" text-anchor="middle" font-size="80">🎁</text></svg>`;
        setPreviewUrl("data:image/svg+xml;base64," + btoa(svgData));
      }
    }
    setCapturing(false);
    setPhase("confirm");
  };

  // ── submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) { alert("Vui lòng nhập họ tên và số điện thoại."); return; }
    setSending(true);
    setSendErr(false);
    try {
      const body = {
        customer: form,
        giftbox: { box: boxId, items: items.map((i) => ({ ...findItem(i.catalogId), x: i.x, y: i.y })) },
        total: 0,
        note: `[GIFTBOX CUSTOM] ${form.message || ""} | ${form.note || ""}`.trim(),
        paymentMethod: "COD",
        deliveryMethod: "DELIVERY",
      };
      const res = await fetch("/api/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) setPhase("done");
      else setSendErr(true);
    } catch { setSendErr(true); }
    finally { setSending(false); }
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // DONE
  if (phase === "done") return (
    <div style={{ minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#fff0f3,#fce4ec)", padding:"2rem", textAlign:"center" }}>
      <div style={{ fontSize:90, marginBottom:"1rem", animation:"bounce 1s ease" }}>🎉</div>
      <h2 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.6rem,4vw,2.4rem)", color:"#922b21", margin:"0 0 0.5rem" }}>Đặt Hàng Thành Công!</h2>
      <p style={{ color:"#888", fontSize:"1.05rem", maxWidth:440, lineHeight:1.6 }}>Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận hộp quà đặc biệt của bạn.</p>
      <button onClick={() => { setPhase("build"); setItems([]); setForm({ name:"",phone:"",address:"",message:"",note:"" }); }}
        style={{ marginTop:"2rem", background:"linear-gradient(135deg,#922b21,#e74c3c)", color:"#fff", border:"none", borderRadius:40, padding:"0.9rem 2.5rem", fontSize:"1rem", cursor:"pointer", fontWeight:700, boxShadow:"0 4px 16px rgba(192,57,43,0.3)" }}>
        🎁 Tạo Hộp Quà Mới
      </button>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}`}</style>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════════
  // CONFIRM
  if (phase === "confirm") {
    const summary = items.map((i) => findItem(i.catalogId)).filter(Boolean);
    return (
      <div style={{ background:"linear-gradient(160deg,#fff5f7,#fce4ec 60%,#fff9f0)", minHeight:"100vh", padding:"2rem 1rem" }}>
        <div style={{ maxWidth:960, margin:"0 auto" }}>
          <button onClick={() => setPhase("build")}
            style={{ background:"none", border:"none", cursor:"pointer", color:"#c0392b", fontSize:"1rem", marginBottom:"1.5rem", fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
            ← Chỉnh sửa lại
          </button>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.5rem,4vw,2.2rem)", color:"#922b21", textAlign:"center", marginBottom:"2rem" }}>
            🎁 Xác Nhận Hộp Quà Của Bạn
          </h1>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"2rem", alignItems:"start" }}>
            {/* preview */}
            <div>
              <h3 style={{ fontFamily:"Georgia,serif", color:"#922b21", marginTop:0 }}>✨ Thiết Kế Của Bạn</h3>
              {previewUrl
                ? <img src={previewUrl} alt="preview" style={{ width:"100%", borderRadius:16, boxShadow:"0 8px 32px rgba(192,57,43,0.18)", border:"3px solid #f8bbd9" }} />
                : <div style={{ width:"100%", paddingBottom:"75%", background:box?.bg, borderRadius:16, border:`3px solid ${box?.border}` }} />
              }
              {summary.length > 0 && (
                <div style={{ marginTop:"1rem", background:"#fff", borderRadius:12, padding:"1rem", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
                  <p style={{ margin:"0 0 8px", fontWeight:700, color:"#922b21", fontSize:"0.85rem" }}>Thành phần hộp quà:</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {summary.map((it, i) => (
                      <span key={i} style={{ background:"#fff0f3", border:"1px solid #f8bbd9", borderRadius:20, padding:"3px 10px", fontSize:"0.78rem", color:"#7b241c" }}>
                        {it.emoji} {it.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* form */}
            <form onSubmit={handleSubmit} style={{ background:"#fff", borderRadius:20, padding:"1.5rem", boxShadow:"0 4px 24px rgba(192,57,43,0.10)" }}>
              <h3 style={{ fontFamily:"Georgia,serif", color:"#922b21", marginTop:0 }}>📋 Thông Tin Giao Hàng</h3>

              {[
                { label:"Họ và Tên *", key:"name", placeholder:"Nguyễn Văn A", type:"text" },
                { label:"Số Điện Thoại *", key:"phone", placeholder:"0901 234 567", type:"tel" },
                { label:"Địa Chỉ Giao Hàng", key:"address", placeholder:"123 Đường ABC, Quận 1, TP.HCM", type:"text" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key} style={{ marginBottom:"1rem" }}>
                  <label style={{ display:"block", fontSize:"0.83rem", fontWeight:700, color:"#7b241c", marginBottom:4 }}>{label}</label>
                  <input type={type} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder} required={key === "name" || key === "phone"}
                    style={{ width:"100%", border:"2px solid #f8bbd9", borderRadius:10, padding:"0.65rem 1rem", fontSize:"0.93rem", outline:"none", boxSizing:"border-box" }}
                    onFocus={(e) => (e.target.style.borderColor = "#e91e8c")}
                    onBlur={(e)  => (e.target.style.borderColor = "#f8bbd9")} />
                </div>
              ))}

              <div style={{ marginBottom:"1rem" }}>
                <label style={{ display:"block", fontSize:"0.83rem", fontWeight:700, color:"#7b241c", marginBottom:4 }}>💌 Lời Nhắn Trong Thiệp</label>
                <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message:e.target.value }))}
                  placeholder="Viết lời yêu thương dành tặng người nhận..." rows={3}
                  style={{ width:"100%", border:"2px solid #f8bbd9", borderRadius:10, padding:"0.65rem 1rem", fontSize:"0.88rem", outline:"none", resize:"vertical", boxSizing:"border-box", fontFamily:"inherit" }} />
              </div>
              <div style={{ marginBottom:"1.5rem" }}>
                <label style={{ display:"block", fontSize:"0.83rem", fontWeight:700, color:"#7b241c", marginBottom:4 }}>📝 Ghi Chú Thêm</label>
                <textarea value={form.note} onChange={(e) => setForm((f) => ({ ...f, note:e.target.value }))}
                  placeholder="Yêu cầu đặc biệt, thời gian giao hàng..." rows={2}
                  style={{ width:"100%", border:"2px solid #f8bbd9", borderRadius:10, padding:"0.65rem 1rem", fontSize:"0.88rem", outline:"none", resize:"vertical", boxSizing:"border-box", fontFamily:"inherit" }} />
              </div>

              {sendErr && <p style={{ color:"#c0392b", fontSize:"0.83rem", marginBottom:"1rem" }}>⚠️ Có lỗi xảy ra. Vui lòng thử lại.</p>}

              <button type="submit" disabled={sending}
                style={{ width:"100%", background: sending?"#ccc":"linear-gradient(135deg,#922b21,#e74c3c)", color:"#fff", border:"none", borderRadius:40, padding:"1rem", fontSize:"1.05rem", fontWeight:700, cursor: sending?"not-allowed":"pointer", boxShadow:"0 4px 16px rgba(192,57,43,0.3)" }}>
                {sending ? "Đang gửi..." : "🎁 Xác Nhận Đặt Hàng"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // BUILD
  return (
    <div style={{ background:"linear-gradient(160deg,#fff5f7 0%,#fce4ec 60%,#fff9f0 100%)", minHeight:"100vh", paddingBottom:"4rem" }}>

      {/* ── Hero ── */}
      <div style={{ background:"linear-gradient(135deg,#7b241c,#c0392b,#e74c3c)", padding:"2.5rem 1rem 2rem", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, opacity:0.07, backgroundImage:"radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize:"32px 32px" }} />
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.8rem,5vw,2.8rem)", color:"#fff", margin:0, textShadow:"0 2px 12px rgba(0,0,0,0.25)" }}>
          Tạo Hộp Quà Riêng
        </h1>
        <p style={{ color:"rgba(255,255,255,0.88)", marginTop:"0.5rem", fontSize:"clamp(0.9rem,2vw,1.1rem)" }}>
          Kéo &amp; thả các phần tử để tạo nên hộp quà độc đáo của riêng bạn
        </p>
        <div style={{ display:"flex", gap:10, justifyContent:"center", marginTop:"1rem", flexWrap:"wrap" }}>
          <button onClick={() => setShowPresets(true)}
            style={{ background:"rgba(255,255,255,0.18)", border:"2px solid rgba(255,255,255,0.5)", color:"#fff", borderRadius:30, padding:"0.55rem 1.5rem", cursor:"pointer", fontSize:"0.9rem", fontWeight:700, backdropFilter:"blur(8px)" }}>
            Xem Mẫu Có Sẵn
          </button>
          <button onClick={() => { setItems([]); setSelId(null); }}
            style={{ background:"rgba(255,255,255,0.10)", border:"2px solid rgba(255,255,255,0.3)", color:"rgba(255,255,255,0.85)", borderRadius:30, padding:"0.55rem 1.5rem", cursor:"pointer", fontSize:"0.9rem", fontWeight:600 }}>
            Bắt Đầu Mới
          </button>
        </div>
      </div>

      {/* ── Preset Modal ── */}
      {showPresets && (
        <div onClick={() => setShowPresets(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ background:"#fff", borderRadius:24, padding:"2rem", maxWidth:700, width:"100%", boxShadow:"0 24px 60px rgba(0,0,0,0.35)", maxHeight:"90vh", overflowY:"auto" }}>
            <h2 style={{ fontFamily:"Georgia,serif", color:"#922b21", marginTop:0, textAlign:"center", fontSize:"1.5rem" }}>🌟 Chọn Mẫu Gợi Ý</h2>
            <p style={{ color:"#aaa", textAlign:"center", marginBottom:"1.5rem", fontSize:"0.88rem" }}>Chọn một mẫu để bắt đầu — bạn có thể chỉnh sửa thêm sau!</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"1rem" }}>
              {PRESETS.map((preset, i) => (
                <button key={i} onClick={() => loadPreset(preset)}
                  style={{ background:"linear-gradient(135deg,#fff0f3,#fce4ec)", border:"2px solid #f8bbd9", borderRadius:18, padding:"1.4rem 1rem", cursor:"pointer", textAlign:"center", transition:"all 0.2s" }}
                  onMouseOver={(e) => { e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow="0 12px 28px rgba(192,57,43,0.2)"; }}
                  onMouseOut={(e)  => { e.currentTarget.style.transform="translateY(0)";   e.currentTarget.style.boxShadow="none"; }}>
                  <div style={{ fontSize:"3rem", marginBottom:10 }}>{preset.emoji}</div>
                  <div style={{ fontWeight:800, color:"#922b21", fontSize:"1rem" }}>{preset.name}</div>
                  <div style={{ color:"#aaa", fontSize:"0.8rem", marginTop:4 }}>{preset.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowPresets(false)}
              style={{ display:"block", margin:"1.5rem auto 0", background:"none", border:"2px solid #e0e0e0", borderRadius:30, padding:"0.5rem 2rem", cursor:"pointer", color:"#999", fontWeight:600 }}>
              Tự Thiết Kế
            </button>
          </div>
        </div>
      )}

      {/* ── Main Grid ── */}
      <div style={{ maxWidth:1120, margin:"2rem auto 0", padding:"0 1rem", display:"grid", gridTemplateColumns:"minmax(0,1fr) 320px", gap:"1.5rem", alignItems:"start" }}>

        {/* LEFT */}
        <div>
          {/* Box picker */}
          <div style={{ background:"#fff", borderRadius:16, padding:"1rem 1.2rem", marginBottom:"1rem", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <p style={{ margin:"0 0 0.7rem", fontWeight:800, color:"#7b241c", fontSize:"0.88rem", letterSpacing:"0.3px" }}>CHỌN LOẠI HỘP</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {BOXES.map((b) => (
                <button key={b.id} onClick={() => setBoxId(b.id)}
                  style={{ background:b.bg, border:`3px solid ${boxId===b.id ? "#922b21":"transparent"}`, borderRadius:12, padding:"0.5rem 1rem", cursor:"pointer", fontSize:"0.82rem", fontWeight:700, color:b.textColor, transition:"all 0.2s", boxShadow:boxId===b.id?"0 4px 16px rgba(146,43,33,0.35)":"none", outline:"none" }}>
                  {b.emoji} {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas wrapper */}
          <div style={{ background:"#fff", borderRadius:20, padding:"1rem 1rem 0.5rem", boxShadow:"0 4px 28px rgba(192,57,43,0.10)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.8rem" }}>
              <span style={{ fontWeight:800, color:"#7b241c", fontSize:"0.88rem" }}>
                KHU VỰC THIẾT KẾ
                {items.length > 0 && <span style={{ color:"#e91e8c", fontWeight:600, fontSize:"0.82rem", marginLeft:6 }}>({items.length} món)</span>}
              </span>
              {items.length > 0 && (
                <button onClick={() => { setItems([]); setSelId(null); }}
                  style={{ background:"none", border:"1px solid #f8bbd9", borderRadius:20, padding:"3px 12px", cursor:"pointer", fontSize:"0.75rem", color:"#c0392b", fontWeight:600 }}>
                  🗑 Xóa hết
                </button>
              )}
            </div>

            {/* THE CANVAS */}
            <div ref={canvasRef} onClick={() => setSelId(null)}
              style={{ position:"relative", width:"100%", paddingBottom:"70%", background:box?.bg, border:`5px solid ${box?.border}`, borderRadius:18, overflow:"hidden", cursor:"default", boxShadow:"inset 0 6px 24px rgba(0,0,0,0.18), 0 8px 32px rgba(0,0,0,0.10)" }}>
              {/* texture */}
              <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:0.05, backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 12px,rgba(0,0,0,1) 12px,rgba(0,0,0,1) 13px),repeating-linear-gradient(90deg,transparent,transparent 12px,rgba(0,0,0,1) 12px,rgba(0,0,0,1) 13px)" }} />
              {/* inner shadow */}
              <div style={{ position:"absolute", inset:0, pointerEvents:"none", boxShadow:"inset 0 0 40px rgba(0,0,0,0.12)", borderRadius:13 }} />

              {items.length === 0 && (
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", pointerEvents:"none", gap:8 }}>
                  <p style={{ color:"rgba(0,0,0,0.3)", fontSize:"0.85rem", textAlign:"center", margin:0, padding:"0 1.5rem", lineHeight:1.6 }}>
                    Nhấn vào phần tử bên phải để thêm<br />hoặc <strong>chọn mẫu có sẵn</strong> để bắt đầu nhanh
                  </p>
                </div>
              )}

              {items.map((item) => (
                <CanvasItem key={item.uid} item={item} selected={selId===item.uid}
                  onSelect={setSelId} onMove={moveItem} onDelete={deleteItem} canvasRef={canvasRef} />
              ))}
            </div>

            <p style={{ fontSize:"0.73rem", color:"#bbb", margin:"0.5rem 0 0", textAlign:"center", paddingBottom:"0.5rem" }}>
             Nhấn để chọn · Kéo để di chuyển · Nhấn ✕ để xóa
            </p>
          </div>

          {/* Save CTA */}
          <button onClick={handleSave} disabled={capturing}
            style={{ width:"100%", marginTop:"1.2rem", background:capturing?"#ccc":"linear-gradient(135deg,#7b241c,#c0392b,#e74c3c)", color:"#fff", border:"none", borderRadius:50, padding:"1.1rem", fontSize:"1.1rem", fontWeight:800, cursor:capturing?"wait":"pointer", letterSpacing:"0.5px", boxShadow:"0 6px 24px rgba(192,57,43,0.38)", transition:"all 0.25s", outline:"none" }}
            onMouseOver={(e) => { if(!capturing) e.currentTarget.style.transform="translateY(-2px)"; }}
            onMouseOut={(e)  => { e.currentTarget.style.transform="translateY(0)"; }}>
            {capturing ? "⏳ Đang lưu thiết kế..." : "Lưu Thiết Kế & Đặt Hàng →"}
          </button>
        </div>

        {/* RIGHT: Elements */}
        <div style={{ background:"#fff", borderRadius:20, padding:"1.2rem", boxShadow:"0 4px 24px rgba(192,57,43,0.08)", position:"sticky", top:80 }}>
          <p style={{ margin:"0 0 1rem", fontWeight:800, color:"#7b241c", textAlign:"center", fontSize:"0.9rem", letterSpacing:"0.3px" }}>KHO</p>

          {/* Tabs */}
          <div style={{ display:"flex", gap:5, marginBottom:"1rem", background:"#fff0f3", borderRadius:30, padding:"4px" }}>
            {Object.keys(CATALOGUE).map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{ flex:1, background:category===cat?"linear-gradient(135deg,#922b21,#e74c3c)":"transparent", color:category===cat?"#fff":"#7b241c", border:"none", borderRadius:26, padding:"0.45rem 0.2rem", cursor:"pointer", fontSize:"0.68rem", fontWeight:800, transition:"all 0.2s", outline:"none" }}>
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {CATALOGUE[category]?.map((item) => (
              <button key={item.id} onClick={() => addItem(item.id)}
                style={{ background:"linear-gradient(135deg,#fff8f9,#fce4ec)", border:"2px solid #f8bbd9", borderRadius:14, padding:"0.85rem 0.5rem", cursor:"pointer", textAlign:"center", transition:"all 0.2s", position:"relative", outline:"none" }}
                onMouseOver={(e) => { e.currentTarget.style.transform="scale(1.07)"; e.currentTarget.style.borderColor="#e91e8c"; e.currentTarget.style.boxShadow="0 6px 18px rgba(233,30,140,0.22)"; }}
                onMouseOut={(e)  => { e.currentTarget.style.transform="scale(1)";    e.currentTarget.style.borderColor="#f8bbd9"; e.currentTarget.style.boxShadow="none"; }}>
                <div style={{ fontSize:"1.9rem", marginBottom:4 }}>{item.emoji}</div>
                <div style={{ fontSize:"0.72rem", fontWeight:800, color:"#7b241c", lineHeight:1.3 }}>{item.label}</div>
                {item.desc && <div style={{ fontSize:"0.62rem", color:"#bbb", marginTop:2 }}>{item.desc}</div>}
                <div style={{ position:"absolute", top:5, right:8, fontSize:"0.75rem", color:"#e91e8c", fontWeight:900 }}>+</div>
              </button>
            ))}
          </div>

          {/* hint */}
          <div style={{ marginTop:"1rem", background:"linear-gradient(135deg,#fff0f3,#fce4ec)", borderRadius:12, padding:"0.75rem 0.9rem", border:"1px solid #f8bbd9" }}>
            <p style={{ margin:0, fontSize:"0.73rem", color:"#922b21", lineHeight:1.65 }}>
              💡 <strong>Mẹo:</strong> Nhấn để thêm nhiều lần. Kéo để sắp xếp. Nhấn vào phần tử trên hộp để chọn rồi ✕ để xóa.
            </p>
          </div>

          <button onClick={() => setShowPresets(true)}
            style={{ width:"100%", marginTop:"1rem", background:"linear-gradient(135deg,#fce4ec,#fff0f3)", border:"2px dashed #e91e8c", borderRadius:14, padding:"0.85rem", cursor:"pointer", fontSize:"0.85rem", fontWeight:800, color:"#922b21", outline:"none" }}>
        Xem Mẫu Có Sẵn
          </button>
        </div>
      </div>

      <style>{`
        @media(max-width:680px){
          div[style*="gridTemplateColumns: minmax(0, 1fr) 320px"]{
            grid-template-columns:1fr!important;
          }
        }
      `}</style>
    </div>
  );
}