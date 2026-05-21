"use client";
import { useState, useRef, useEffect, useCallback } from "react";

// ─── ELEMENT CATALOGUE ───────────────────────────────────────────────────────
const CATALOGUE = {
  products: [
    { id: "saffron_red",   label: "Saffron Đỏ",     emoji: "🫙", color: "#c0392b", desc: "Saffron ngâm mật ong" },
    { id: "saffron_gold",  label: "Saffron Vàng",   emoji: "🍯", color: "#d4a017", desc: "Saffron nguyên chất" },
    { id: "honey_jar",     label: "Mật Ong",        emoji: "🍶", color: "#e67e22", desc: "Mật ong hoa rừng" },
  ],
  flowers: [
    { id: "rose_red",    label: "Hồng Đỏ",    emoji: "🌹", color: "#e74c3c" },
    { id: "rose_pink",   label: "Hồng Hồng",  emoji: "🌸", color: "#e91e8c" },
    { id: "rose_white",  label: "Hồng Trắng", emoji: "🤍", color: "#ecf0f1" },
    { id: "orchid",      label: "Lan Trắng",  emoji: "🌼", color: "#f8f9fa" },
    { id: "lavender",    label: "Oải Hương",  emoji: "💜", color: "#9b59b6" },
    { id: "baby_breath", label: "Baby's Breath", emoji: "🌿", color: "#27ae60" },
  ],
  decorations: [
    { id: "ribbon_red",   label: "Ruy Băng Đỏ",  emoji: "🎀", color: "#e74c3c" },
    { id: "ribbon_gold",  label: "Ruy Băng Vàng", emoji: "✨", color: "#f39c12" },
    { id: "pearl_chain",  label: "Chuỗi Ngọc",   emoji: "📿", color: "#bdc3c7" },
    { id: "gold_frame",   label: "Khung Vàng",   emoji: "🖼️", color: "#f1c40f" },
    { id: "message_card", label: "Thiệp",        emoji: "💌", color: "#fd79a8" },
    { id: "crystal",      label: "Đá Pha Lê",    emoji: "💎", color: "#74b9ff" },
  ],
  boxes: [
    { id: "box_wood",  label: "Hộp Gỗ",       emoji: "📦", bg: "linear-gradient(135deg,#d4a96a,#b8860b)", border: "#8B6914" },
    { id: "box_white", label: "Hộp Trắng",    emoji: "🗃️",  bg: "linear-gradient(135deg,#fdfcfb,#ede8e3)", border: "#c9b99a" },
    { id: "box_red",   label: "Hộp Đỏ Nhung", emoji: "🎁",  bg: "linear-gradient(135deg,#c0392b,#922b21)", border: "#641e16" },
    { id: "box_pink",  label: "Hộp Hồng",     emoji: "🎀",  bg: "linear-gradient(135deg,#ffeef8,#f8bbd9)", border: "#e91e8c" },
  ],
};

const SAMPLE_PRESETS = [
  {
    name: "Lãng Mạn Đỏ",
    desc: "Hoàn hảo cho người yêu",
    emoji: "❤️",
    box: "box_red",
    items: [
      { catalogueId: "saffron_red", x: 30, y: 35 },
      { catalogueId: "rose_red",    x: 58, y: 28 },
      { catalogueId: "rose_red",    x: 62, y: 55 },
      { catalogueId: "orchid",      x: 52, y: 20 },
      { catalogueId: "ribbon_red",  x: 20, y: 20 },
      { catalogueId: "pearl_chain", x: 40, y: 15 },
      { catalogueId: "message_card",x: 15, y: 60 },
    ],
  },
  {
    name: "Thanh Lịch Hồng",
    desc: "Nhẹ nhàng & tinh tế",
    emoji: "🌸",
    box: "box_pink",
    items: [
      { catalogueId: "saffron_gold", x: 28, y: 38 },
      { catalogueId: "rose_pink",    x: 57, y: 25 },
      { catalogueId: "rose_white",   x: 58, y: 55 },
      { catalogueId: "baby_breath",  x: 48, y: 15 },
      { catalogueId: "ribbon_gold",  x: 18, y: 18 },
      { catalogueId: "crystal",      x: 68, y: 70 },
      { catalogueId: "gold_frame",   x: 15, y: 55 },
    ],
  },
  {
    name: "Quà Gỗ Tự Nhiên",
    desc: "Mộc mạc & ấm áp",
    emoji: "🌿",
    box: "box_wood",
    items: [
      { catalogueId: "honey_jar",    x: 25, y: 35 },
      { catalogueId: "saffron_gold", x: 48, y: 38 },
      { catalogueId: "rose_pink",    x: 62, y: 28 },
      { catalogueId: "lavender",     x: 58, y: 58 },
      { catalogueId: "baby_breath",  x: 40, y: 18 },
      { catalogueId: "ribbon_gold",  x: 20, y: 55 },
      { catalogueId: "message_card", x: 15, y: 22 },
    ],
  },
];

// ─── FIND ITEM IN CATALOGUE ───────────────────────────────────────────────────
function findCatalogueItem(id) {
  for (const group of Object.values(CATALOGUE)) {
    const found = group.find((i) => i.id === id);
    if (found) return found;
  }
  return null;
}

// ─── DRAGGABLE ITEM ON CANVAS ────────────────────────────────────────────────
function CanvasItem({ item, isSelected, onSelect, onMove, onDelete, canvasRef }) {
  const info = findCatalogueItem(item.catalogueId);
  const dragStartRef = useRef(null);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    onSelect(item.id);
    const rect = canvasRef.current.getBoundingClientRect();
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: item.x,
      origY: item.y,
      rectW: rect.width,
      rectH: rect.height,
    };

    const onMouseMove = (me) => {
      const { startX, startY, origX, origY, rectW, rectH } = dragStartRef.current;
      const dx = ((me.clientX - startX) / rectW) * 100;
      const dy = ((me.clientY - startY) / rectH) * 100;
      onMove(item.id, Math.max(2, Math.min(88, origX + dx)), Math.max(2, Math.min(88, origY + dy)));
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Touch support
  const handleTouchStart = (e) => {
    e.stopPropagation();
    onSelect(item.id);
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    dragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      origX: item.x,
      origY: item.y,
      rectW: rect.width,
      rectH: rect.height,
    };
    const onTouchMove = (te) => {
      const t = te.touches[0];
      const { startX, startY, origX, origY, rectW, rectH } = dragStartRef.current;
      const dx = ((t.clientX - startX) / rectW) * 100;
      const dy = ((t.clientY - startY) / rectH) * 100;
      onMove(item.id, Math.max(2, Math.min(88, origX + dx)), Math.max(2, Math.min(88, origY + dy)));
    };
    const onTouchEnd = () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        position: "absolute",
        left: `${item.x}%`,
        top: `${item.y}%`,
        transform: "translate(-50%,-50%)",
        cursor: "grab",
        userSelect: "none",
        zIndex: isSelected ? 20 : 10,
        transition: "filter 0.15s",
        filter: isSelected ? "drop-shadow(0 0 8px rgba(230,57,70,0.8))" : "none",
      }}
    >
      <div style={{ position: "relative", display: "inline-block" }}>
        <span style={{ fontSize: "clamp(28px, 4.5vw, 48px)", lineHeight: 1 }}>
          {info?.emoji || "❓"}
        </span>
        {isSelected && (
          <button
            onMouseDown={(e) => { e.stopPropagation(); onDelete(item.id); }}
            style={{
              position: "absolute",
              top: -8, right: -8,
              background: "#e63946",
              border: "none",
              borderRadius: "50%",
              width: 18, height: 18,
              color: "#fff",
              fontSize: 11,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              lineHeight: 1,
            }}
          >✕</button>
        )}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function GiftboxBuilderPage() {
  const [selectedBox, setSelectedBox] = useState("box_wood");
  const [canvasItems, setCanvasItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("flowers");
  const [phase, setPhase] = useState("build"); // build | confirm
  const [screenshotDataUrl, setScreenshotDataUrl] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "", message: "", note: "" });
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);

  const canvasRef = useRef(null);
  const idCounter = useRef(0);

  const boxInfo = CATALOGUE.boxes.find((b) => b.id === selectedBox);

  // ── add item to canvas ──
  const addToCanvas = useCallback((catalogueId) => {
    idCounter.current += 1;
    setCanvasItems((prev) => [
      ...prev,
      { id: `item_${idCounter.current}`, catalogueId, x: 30 + Math.random() * 40, y: 25 + Math.random() * 50 },
    ]);
  }, []);

  // ── move item ──
  const moveItem = useCallback((id, x, y) => {
    setCanvasItems((prev) => prev.map((i) => (i.id === id ? { ...i, x, y } : i)));
  }, []);

  // ── delete item ──
  const deleteItem = useCallback((id) => {
    setCanvasItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedItemId(null);
  }, []);

  // ── load preset ──
  const loadPreset = (preset) => {
    setSelectedBox(preset.box);
    idCounter.current = 0;
    setCanvasItems(
      preset.items.map((it, idx) => ({
        id: `item_${idx + 1}`,
        catalogueId: it.catalogueId,
        x: it.x,
        y: it.y,
      }))
    );
    idCounter.current = preset.items.length;
    setShowSamples(false);
  };

  // ── screenshot & proceed ──
  const handleSave = async () => {
    if (canvasItems.length === 0) {
      alert("Hãy thêm ít nhất một món vào hộp quà nhé! 🎁");
      return;
    }
    setIsCapturing(true);
    try {
      // Use html2canvas via CDN loaded dynamically
      if (typeof window !== "undefined") {
        const html2canvas = (await import("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js")).default;
        const canvas = await html2canvas(canvasRef.current, {
          backgroundColor: null,
          useCORS: true,
          scale: 2,
          logging: false,
        });
        setScreenshotDataUrl(canvas.toDataURL("image/png"));
      }
    } catch (err) {
      // Fallback: use a canvas drawing
      const fallbackCanvas = document.createElement("canvas");
      fallbackCanvas.width = 400;
      fallbackCanvas.height = 400;
      const ctx = fallbackCanvas.getContext("2d");
      ctx.fillStyle = "#fef0f3";
      ctx.fillRect(0, 0, 400, 400);
      ctx.font = "60px serif";
      ctx.textAlign = "center";
      ctx.fillText("🎁", 200, 200);
      ctx.font = "18px serif";
      ctx.fillStyle = "#c0392b";
      ctx.fillText("Hộp quà của bạn", 200, 280);
      setScreenshotDataUrl(fallbackCanvas.toDataURL("image/png"));
    }
    setIsCapturing(false);
    setPhase("confirm");
  };

  // ── submit order ──
  const handleOrder = async (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.phone) {
      alert("Vui lòng nhập họ tên và số điện thoại.");
      return;
    }
    setOrderLoading(true);
    try {
      const body = {
        customer: orderForm,
        giftbox: {
          box: selectedBox,
          items: canvasItems.map((i) => ({
            ...findCatalogueItem(i.catalogueId),
            position: { x: i.x, y: i.y },
          })),
          screenshotDataUrl,
        },
        total: 0,
        note: `[GIFTBOX CUSTOM] ${orderForm.message}`,
        paymentMethod: "COD",
        deliveryMethod: "DELIVERY",
      };
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setOrderStatus("success");
      } else {
        setOrderStatus("error");
      }
    } catch {
      setOrderStatus("error");
    } finally {
      setOrderLoading(false);
    }
  };

  const categoryKeys = Object.keys(CATALOGUE).filter((k) => k !== "boxes");
  const categoryLabels = { products: "🫙 Sản Phẩm", flowers: "🌸 Hoa", decorations: "✨ Trang Trí" };

  // ─────────────────────────────────────────────────────────────────────────────
  if (orderStatus === "success") {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#fff0f3,#ffe4ec)", padding: "2rem" }}>
        <div style={{ fontSize: 80 }}>🎉</div>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "2rem", color: "#c0392b", margin: "1rem 0 0.5rem" }}>Đặt Hàng Thành Công!</h2>
        <p style={{ color: "#7f8c8d", fontSize: "1.1rem", marginBottom: "2rem", textAlign: "center" }}>
          Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng hộp quà đặc biệt.
        </p>
        <button onClick={() => { setPhase("build"); setOrderStatus(null); setCanvasItems([]); }}
          style={{ background: "#c0392b", color: "#fff", border: "none", borderRadius: 40, padding: "0.9rem 2.5rem", fontSize: "1rem", cursor: "pointer", fontWeight: 700 }}>
          Tạo Hộp Quà Mới
        </button>
      </div>
    );
  }

  // ─── CONFIRM PHASE ───────────────────────────────────────────────────────────
  if (phase === "confirm") {
    const itemsSummary = canvasItems.map((i) => findCatalogueItem(i.catalogueId)).filter(Boolean);
    return (
      <div style={{ background: "linear-gradient(160deg,#fff5f7 0%,#fce4ec 100%)", minHeight: "100vh", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* back */}
          <button onClick={() => setPhase("build")} style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", fontSize: "1rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
            ← Chỉnh sửa lại
          </button>

          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.6rem,4vw,2.4rem)", color: "#922b21", textAlign: "center", marginBottom: "2rem" }}>
            🎁 Xác Nhận Hộp Quà Của Bạn
          </h1>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
            {/* Preview */}
            <div>
              <h3 style={{ fontFamily: "Georgia,serif", color: "#922b21", marginBottom: "1rem" }}>Thiết Kế Của Bạn</h3>
              {screenshotDataUrl ? (
                <img src={screenshotDataUrl} alt="Hộp quà của bạn" style={{ width: "100%", borderRadius: 16, boxShadow: "0 8px 32px rgba(192,57,43,0.18)", border: "3px solid #f8bbd9" }} />
              ) : (
                <div style={{ width: "100%", aspectRatio: "1", background: boxInfo?.bg, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>🎁</div>
              )}
              {/* items list */}
              <div style={{ marginTop: "1rem", background: "#fff", borderRadius: 12, padding: "1rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <p style={{ fontWeight: 700, color: "#922b21", marginBottom: 8, fontSize: "0.9rem" }}>Thành phần hộp quà:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {itemsSummary.map((it, idx) => (
                    <span key={idx} style={{ background: "#fff0f3", border: "1px solid #f8bbd9", borderRadius: 20, padding: "3px 12px", fontSize: "0.82rem", color: "#7b241c" }}>
                      {it.emoji} {it.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleOrder} style={{ background: "#fff", borderRadius: 20, padding: "1.5rem", boxShadow: "0 4px 24px rgba(192,57,43,0.10)" }}>
              <h3 style={{ fontFamily: "Georgia,serif", color: "#922b21", marginBottom: "1.2rem" }}>Thông Tin Giao Hàng</h3>

              {[
                { label: "Họ và Tên *", key: "name", placeholder: "Nguyễn Văn A", type: "text" },
                { label: "Số Điện Thoại *", key: "phone", placeholder: "0901 234 567", type: "tel" },
                { label: "Địa Chỉ Giao Hàng", key: "address", placeholder: "123 Nguyễn Trãi, Q.1, TP.HCM", type: "text" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key} style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#7b241c", marginBottom: 4 }}>{label}</label>
                  <input
                    type={type}
                    value={orderForm[key]}
                    onChange={(e) => setOrderForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{ width: "100%", border: "2px solid #f8bbd9", borderRadius: 10, padding: "0.65rem 1rem", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                    onFocus={(e) => (e.target.style.borderColor = "#e91e8c")}
                    onBlur={(e) => (e.target.style.borderColor = "#f8bbd9")}
                  />
                </div>
              ))}

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#7b241c", marginBottom: 4 }}>💌 Lời Nhắn Trong Thiệp</label>
                <textarea
                  value={orderForm.message}
                  onChange={(e) => setOrderForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Viết lời yêu thương dành tặng người nhận..."
                  rows={3}
                  style={{ width: "100%", border: "2px solid #f8bbd9", borderRadius: 10, padding: "0.65rem 1rem", fontSize: "0.9rem", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#7b241c", marginBottom: 4 }}>📝 Ghi Chú Thêm</label>
                <textarea
                  value={orderForm.note}
                  onChange={(e) => setOrderForm((f) => ({ ...f, note: e.target.value }))}
                  placeholder="Yêu cầu đặc biệt, thời gian giao hàng..."
                  rows={2}
                  style={{ width: "100%", border: "2px solid #f8bbd9", borderRadius: 10, padding: "0.65rem 1rem", fontSize: "0.9rem", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
                />
              </div>

              {orderStatus === "error" && (
                <p style={{ color: "#c0392b", fontSize: "0.85rem", marginBottom: "1rem" }}>⚠️ Có lỗi xảy ra. Vui lòng thử lại.</p>
              )}

              <button type="submit" disabled={orderLoading}
                style={{ width: "100%", background: orderLoading ? "#ccc" : "linear-gradient(135deg,#c0392b,#e74c3c)", color: "#fff", border: "none", borderRadius: 40, padding: "1rem", fontSize: "1.05rem", fontWeight: 700, cursor: orderLoading ? "not-allowed" : "pointer", letterSpacing: "0.5px", boxShadow: "0 4px 16px rgba(192,57,43,0.3)" }}>
                {orderLoading ? "Đang gửi..." : "🎁 Xác Nhận Đặt Hàng"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ─── BUILD PHASE ─────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "linear-gradient(160deg,#fff5f7 0%,#fce4ec 60%,#fff9f0 100%)", minHeight: "100vh", paddingBottom: "4rem" }}>
      {/* ── Hero Banner ── */}
      <div style={{ background: "linear-gradient(135deg,#922b21,#c0392b,#e74c3c)", padding: "2.5rem 1rem 2rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.8rem,5vw,3rem)", color: "#fff", margin: 0, letterSpacing: "1px", textShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
          Tạo Hộp Quà Riêng
        </h1>
        <p style={{ color: "rgba(255,255,255,0.85)", marginTop: "0.5rem", fontSize: "clamp(0.9rem,2vw,1.1rem)" }}>
          Kéo & thả để tùy chỉnh hộp quà theo ý muốn của bạn
        </p>
        <button onClick={() => setShowSamples(true)}
          style={{ marginTop: "1rem", background: "rgba(255,255,255,0.18)", border: "2px solid rgba(255,255,255,0.5)", color: "#fff", borderRadius: 30, padding: "0.55rem 1.5rem", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600, backdropFilter: "blur(8px)" }}>
          Xem Mẫu Có Sẵn
        </button>
      </div>

      {/* ── Sample Modal ── */}
      {showSamples && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
          onClick={() => setShowSamples(false)}>
          <div style={{ background: "#fff", borderRadius: 24, padding: "2rem", maxWidth: 680, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
            onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: "Georgia,serif", color: "#922b21", marginTop: 0, textAlign: "center" }}>🌟 Chọn Mẫu Gợi Ý</h2>
            <p style={{ color: "#888", textAlign: "center", marginBottom: "1.5rem", fontSize: "0.9rem" }}>Chọn một mẫu để bắt đầu, bạn có thể chỉnh sửa thêm sau!</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "1rem" }}>
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button key={idx} onClick={() => loadPreset(preset)}
                  style={{ background: "linear-gradient(135deg,#fff0f3,#fce4ec)", border: "2px solid #f8bbd9", borderRadius: 16, padding: "1.2rem 1rem", cursor: "pointer", textAlign: "center", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(192,57,43,0.08)" }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(192,57,43,0.18)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(192,57,43,0.08)"; }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>{preset.emoji}</div>
                  <div style={{ fontWeight: 700, color: "#922b21", fontSize: "0.95rem" }}>{preset.name}</div>
                  <div style={{ color: "#888", fontSize: "0.8rem", marginTop: 4 }}>{preset.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowSamples(false)}
              style={{ display: "block", margin: "1.5rem auto 0", background: "none", border: "2px solid #e0e0e0", borderRadius: 30, padding: "0.5rem 2rem", cursor: "pointer", color: "#888" }}>
              Tự Thiết Kế
            </button>
          </div>
        </div>
      )}

      {/* ── Main Layout ── */}
      <div style={{ maxWidth: 1100, margin: "2rem auto 0", padding: "0 1rem", display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "start" }}>

        {/* LEFT: Canvas */}
        <div>
          {/* Box selector */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "1rem 1.2rem", marginBottom: "1rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p style={{ margin: "0 0 0.7rem", fontWeight: 700, color: "#7b241c", fontSize: "0.9rem" }}>📦 Chọn Loại Hộp</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {CATALOGUE.boxes.map((box) => (
                <button key={box.id} onClick={() => setSelectedBox(box.id)}
                  style={{ background: box.bg, border: `3px solid ${selectedBox === box.id ? "#922b21" : "transparent"}`, borderRadius: 12, padding: "0.5rem 1rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, color: box.id === "box_red" ? "#fff" : "#4a2c2a", transition: "all 0.2s", boxShadow: selectedBox === box.id ? "0 4px 16px rgba(146,43,33,0.3)" : "none" }}>
                  {box.emoji} {box.label}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "1rem", boxShadow: "0 4px 24px rgba(192,57,43,0.10)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
              <span style={{ fontWeight: 700, color: "#7b241c", fontSize: "0.9rem" }}>
                🎨 Khu Vực Thiết Kế {canvasItems.length > 0 && <span style={{ color: "#e91e8c" }}>({canvasItems.length} món)</span>}
              </span>
              {canvasItems.length > 0 && (
                <button onClick={() => { setCanvasItems([]); setSelectedItemId(null); }}
                  style={{ background: "none", border: "1px solid #f8bbd9", borderRadius: 20, padding: "3px 12px", cursor: "pointer", fontSize: "0.78rem", color: "#c0392b" }}>
                  🗑️ Xóa hết
                </button>
              )}
            </div>

            {/* THE BOX CANVAS */}
            <div
              ref={canvasRef}
              onClick={() => setSelectedItemId(null)}
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "75%",
                background: boxInfo?.bg || "#f5e6d3",
                border: `4px solid ${boxInfo?.border || "#8B6914"}`,
                borderRadius: 16,
                overflow: "hidden",
                cursor: "default",
                boxShadow: "inset 0 4px 20px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.12)",
              }}
            >
              {/* wood grain / texture overlay */}
              <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,1) 8px, rgba(0,0,0,1) 9px)", pointerEvents: "none" }} />

              {canvasItems.length === 0 && (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  <div style={{ fontSize: "3rem", opacity: 0.3 }}>🎁</div>
                  <p style={{ color: "rgba(0,0,0,0.35)", fontSize: "0.85rem", textAlign: "center", marginTop: 8, padding: "0 1rem" }}>
                    Nhấn vào các món bên phải để thêm vào hộp<br />hoặc xem <strong>mẫu có sẵn</strong> để bắt đầu
                  </p>
                </div>
              )}

              {canvasItems.map((item) => (
                <CanvasItem
                  key={item.id}
                  item={item}
                  isSelected={selectedItemId === item.id}
                  onSelect={setSelectedItemId}
                  onMove={moveItem}
                  onDelete={deleteItem}
                  canvasRef={canvasRef}
                />
              ))}
            </div>

            <p style={{ fontSize: "0.78rem", color: "#aaa", marginTop: "0.5rem", textAlign: "center" }}>
              💡 Kéo để di chuyển · Nhấn vào để chọn · Nhấn ✕ để xóa
            </p>
          </div>

          {/* Save button */}
          <button onClick={handleSave} disabled={isCapturing}
            style={{ width: "100%", marginTop: "1.2rem", background: isCapturing ? "#ccc" : "linear-gradient(135deg,#922b21,#e74c3c)", color: "#fff", border: "none", borderRadius: 50, padding: "1.1rem", fontSize: "1.1rem", fontWeight: 700, cursor: isCapturing ? "wait" : "pointer", letterSpacing: "0.5px", boxShadow: "0 6px 24px rgba(192,57,43,0.35)", transition: "all 0.2s" }}>
            {isCapturing ? "⏳ Đang lưu thiết kế..." : "📸 Lưu & Đặt Hàng Ngay →"}
          </button>
        </div>

        {/* RIGHT: Elements Panel */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "1.2rem", boxShadow: "0 4px 24px rgba(192,57,43,0.08)", position: "sticky", top: 80 }}>
          <p style={{ margin: "0 0 1rem", fontWeight: 700, color: "#7b241c", fontSize: "0.95rem", textAlign: "center" }}>
            ✨ Kho Phần Tử
          </p>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: "1rem", background: "#fff0f3", borderRadius: 30, padding: "4px" }}>
            {categoryKeys.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ flex: 1, background: activeCategory === cat ? "linear-gradient(135deg,#922b21,#e74c3c)" : "transparent", color: activeCategory === cat ? "#fff" : "#7b241c", border: "none", borderRadius: 26, padding: "0.45rem 0.3rem", cursor: "pointer", fontSize: "0.72rem", fontWeight: 700, transition: "all 0.2s" }}>
                {categoryLabels[cat]}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {CATALOGUE[activeCategory]?.map((item) => (
              <button key={item.id} onClick={() => addToCanvas(item.id)}
                style={{ background: "linear-gradient(135deg,#fff8f9,#fce4ec)", border: "2px solid #f8bbd9", borderRadius: 14, padding: "0.8rem 0.5rem", cursor: "pointer", textAlign: "center", transition: "all 0.2s", position: "relative" }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.borderColor = "#e91e8c"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(233,30,140,0.2)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "#f8bbd9"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: "2rem", marginBottom: 4 }}>{item.emoji}</div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7b241c", lineHeight: 1.3 }}>{item.label}</div>
                {item.desc && <div style={{ fontSize: "0.65rem", color: "#aaa", marginTop: 2 }}>{item.desc}</div>}
                <div style={{ position: "absolute", top: 5, right: 7, fontSize: "0.65rem", color: "#e91e8c", fontWeight: 700 }}>+</div>
              </button>
            ))}
          </div>

          {/* tip */}
          <div style={{ marginTop: "1.2rem", background: "linear-gradient(135deg,#fff0f3,#fce4ec)", borderRadius: 12, padding: "0.8rem", border: "1px solid #f8bbd9" }}>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#922b21", lineHeight: 1.6 }}>
              💡 <strong>Mẹo:</strong> Nhấn vào phần tử để thêm nhiều lần. Kéo để sắp xếp lại theo ý bạn!
            </p>
          </div>

          <button onClick={() => setShowSamples(true)}
            style={{ width: "100%", marginTop: "1rem", background: "linear-gradient(135deg,#fce4ec,#fff0f3)", border: "2px dashed #e91e8c", borderRadius: 14, padding: "0.8rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, color: "#922b21" }}>
            🌟 Xem Mẫu Có Sẵn
          </button>
        </div>
      </div>

      {/* responsive styles */}
      <style>{`
        @media (max-width: 700px) {
          .giftbox-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}