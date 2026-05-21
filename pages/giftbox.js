import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
// DATA
const CATALOGUE = {
    products: [
        {
            id: "saffron_red",
            label: "Saffron Đỏ",
            image:
                "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop",
            desc: "Saffron ngâm mật ong",
        },
        {
            id: "saffron_gold",
            label: "Saffron Vàng",
            image:
                "https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=800&auto=format&fit=crop",
            desc: "Saffron nguyên chất",
        },
        {
            id: "honey_jar",
            label: "Mật Ong",
            image:
                "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?q=80&w=800&auto=format&fit=crop",
            desc: "Mật ong hoa rừng",
        },
    ],

    flowers: [
        {
            id: "rose_red",
            label: "Hồng Đỏ",
            image:
                "https://images.unsplash.com/photo-1518709779341-56cf4535e94b?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: "orchid",
            label: "Lan Trắng",
            image:
                "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: "lavender",
            label: "Oải Hương",
            image:
                "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop",
        },
    ],

    decorations: [
        {
            id: "ribbon_red",
            label: "Ruy Băng Đỏ",
            image:
                "https://images.unsplash.com/photo-1513475382585-d06e58bcb0ff?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: "ribbon_gold",
            label: "Ruy Băng Vàng",
            image:
                "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: "pearl_chain",
            label: "Chuỗi Ngọc",
            image:
                "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: "gold_frame",
            label: "Khung Vàng",
            image:
                "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: "message_card",
            label: "Thiệp",
            image:
                "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: "crystal",
            label: "Đá Pha Lê",
            image:
                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
        },
    ],
};

const BOXES = [
    {
        id: "box_wood",
        label: "Hộp Gỗ",
        bg: "linear-gradient(135deg,#d4a96a,#b8860b)",
        border: "#8B6914",
        textColor: "#4a2c2a",
    },
    {
        id: "box_white",
        label: "Hộp Trắng",
        bg: "linear-gradient(135deg,#fdfcfb,#ede8e3)",
        border: "#c9b99a",
        textColor: "#4a2c2a",
    },
    {
        id: "box_red",
        label: "Hộp Đỏ Nhung",
        bg: "linear-gradient(135deg,#c0392b,#922b21)",
        border: "#641e16",
        textColor: "#fff",
    },
    {
        id: "box_pink",
        label: "Hộp Hồng",
        bg: "linear-gradient(135deg,#ffeef8,#f8bbd9)",
        border: "#e91e8c",
        textColor: "#4a2c2a",
    },
];

const CATEGORY_LABELS = {
    products: "Sản Phẩm",
    flowers: "Hoa",
    decorations: "Trang Trí",
};

const CUP_POSITIONS = {
    left: 0,
    center: 33.333,
    right: 66.666,
};

const CUP_WIDTH = 33.333;

function findItem(id) {
    for (const group of Object.values(CATALOGUE)) {
        const found = group.find((i) => i.id === id);
        if (found) return found;
    }

    return null;
}

// ─────────────────────────────────────────────────────────────
// DRAG ITEM
// ─────────────────────────────────────────────────────────────

function CanvasItem({
    item,
    selected,
    onSelect,
    onMove,
    onDelete,
    canvasRef,
    isMobile,
}) {
    const info = findItem(item.catalogId);

    const drag = useRef(null);

    const startDrag = (clientX, clientY) => {
        const rect = canvasRef.current.getBoundingClientRect();

        drag.current = {
            startX: clientX,
            startY: clientY,
            origX: item.x,
            origY: item.y,
            W: rect.width,
            H: rect.height,
        };
    };

    const handleMove = (clientX, clientY) => {
        if (!drag.current) return;

        const { startX, startY, origX, origY, W, H } =
            drag.current;

        onMove(
            item.uid,
            Math.max(
                4,
                Math.min(92, origX + ((clientX - startX) / W) * 100)
            ),
            Math.max(
                4,
                Math.min(92, origY + ((clientY - startY) / H) * 100)
            )
        );
    };

    // DESKTOP
    const onMouseDown = (e) => {
        e.stopPropagation();

        onSelect(item.uid);

        startDrag(e.clientX, e.clientY);

        const mm = (me) => {
            handleMove(me.clientX, me.clientY);
        };

        const mu = () => {
            window.removeEventListener("mousemove", mm);
            window.removeEventListener("mouseup", mu);
        };

        window.addEventListener("mousemove", mm);
        window.addEventListener("mouseup", mu);
    };

    // MOBILE
    const onTouchStart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        onSelect(item.uid);

        const touch = e.touches[0];

        startDrag(touch.clientX, touch.clientY);

        const tm = (te) => {
            const t = te.touches[0];

            handleMove(t.clientX, t.clientY);
        };

        const tu = () => {
            window.removeEventListener("touchmove", tm);
            window.removeEventListener("touchend", tu);
        };

        window.addEventListener("touchmove", tm, {
            passive: false,
        });

        window.addEventListener("touchend", tu);
    };

    return (
        <div
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            style={{
                position: "absolute",
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: "translate(-50%,-50%)",
                zIndex: selected ? 20 : 10,
                cursor: "grab",
                userSelect: "none",
                transition: "0.15s",
                touchAction: "none",
            }}
        >
            <img
                src={info?.image}
                alt={info?.label}
                draggable={false}
                style={{
                    width: isMobile
                        ? "72px"
                        : "clamp(52px,7vw,90px)",

                    height: isMobile
                        ? "72px"
                        : "clamp(52px,7vw,90px)",
                    objectFit: "cover",
                    borderRadius: 16,
                    border: selected
                        ? "3px solid #e91e8c"
                        : "2px solid rgba(255,255,255,0.7)",
                    boxShadow: selected
                        ? "0 0 18px rgba(233,30,140,0.7)"
                        : "0 4px 12px rgba(0,0,0,0.18)",
                    pointerEvents: "none",
                }}
            />

            {selected && (
                <button
                    onTouchStart={(e) => {
                        e.stopPropagation();
                        onDelete(item.uid);
                    }}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        onDelete(item.uid);
                    }}
                    style={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        border: "2px solid white",
                        background: "#e63946",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: 900,
                    }}
                >
                    ×
                </button>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

export default function GiftboxPage() {
    const router = useRouter();

    const [boxId, setBoxId] = useState("box_wood");

    const [items, setItems] = useState([]);

    const [selectedId, setSelectedId] = useState(null);

    const [category, setCategory] = useState("flowers");

    const [capturing, setCapturing] = useState(false);

    const [cupPosition, setCupPosition] = useState("left");

    const canvasRef = useRef(null);

    const uidRef = useRef(0);

    const box = BOXES.find((b) => b.id === boxId);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 900);
        };

        checkMobile();

        window.addEventListener("resize", checkMobile);

        return () =>
            window.removeEventListener(
                "resize",
                checkMobile
            );
    }, []);

    // ─────────────────────────────

    const addItem = useCallback((catalogId) => {
        if (!catalogId) return;

        uidRef.current += 1;

        const newItem = {
            uid: `u${uidRef.current}`,
            catalogId,
            x: 50,
            y: 50,
        };

        setItems((prev) => [...prev, newItem]);
    }, []);

    // ─────────────────────────────

    const isInsideCupZone = (x) => {
        const start = CUP_POSITIONS[cupPosition];

        const end = start + CUP_WIDTH;

        return x >= start && x <= end;
    };

    // ─────────────────────────────

    const moveItem = useCallback(
        (uid, x, y) => {
            if (isInsideCupZone(x)) return;

            setItems((prev) =>
                prev.map((i) =>
                    i.uid === uid
                        ? {
                            ...i,
                            x,
                            y,
                        }
                        : i
                )
            );
        },
        [cupPosition]
    );

    // ─────────────────────────────

    const deleteItem = (uid) => {
        setItems((prev) => prev.filter((i) => i.uid !== uid));

        setSelectedId(null);
    };

    // ─────────────────────────────

    const handleSave = async () => {
        const validItems = items.filter((i) => i.catalogId);

        if (validItems.length < 1) {
            alert("Vui lòng thêm ít nhất 1 phần tử vào hộp quà.");
            return;
        }

        setCapturing(true);

        try {
            const h2c = (await import("html2canvas")).default;

            const canvas = await h2c(canvasRef.current, {
                backgroundColor: null,
                useCORS: true,
                scale: 2,
                logging: false,
            });

            const image = canvas.toDataURL("image/png");

            // lưu localStorage để checkout page dùng
            localStorage.setItem(
                "giftbox_design",
                JSON.stringify({
                    preview: image,
                    items: validItems,
                    boxId,
                    cupPosition,
                })
            );

            // chuyển sang checkout page
            router.push("/giftbox-checkout");

        } catch (err) {
            console.error(err);
            alert("Không thể lưu thiết kế.");
        } finally {
            setCapturing(false);
        }
    };

    // ─────────────────────────────────────────────────────────

    return (
        <div
            style={{
                background:
                    "#fde8ed",
                minHeight: "100vh",
                paddingBottom: "4rem",
            }}
        >
            {/* HERO */}

            <div
                style={{
                    background:
                        "#fde8ed",
                    padding: "2.5rem 1rem 0rem",
                    textAlign: "center",
                }}
            >
                <h1 className="text-4xl font-bold text-[#601C1F] mb-8 text-center">
                    Tạo Hộp Quà Riêng
                </h1>

                <p className="text-xl italic text-[#601C1F] mb-8 text-center">
                    Thiết kế hộp quà theo ý bạn
                </p>
            </div>

            {/* MAIN */}

            <div
                style={{
                    maxWidth: 1120,
                    margin: "2rem auto 0",
                    padding: "0 1rem",
                    display: "grid",
                    gridTemplateColumns: isMobile
                        ? "1fr"
                        : "minmax(0,1fr) 320px",
                    gap: "1.5rem",
                }}
            >
                {/* LEFT */}

                <div>
                    {/* BOX PICKER */}

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 18,
                            padding: "1rem",
                            marginBottom: "1rem",
                            boxShadow: "0 2px 18px rgba(0,0,0,0.05)",
                        }}
                    >
                        <p
                            style={{
                                fontWeight: 800,
                                color: "#7b241c",
                                marginBottom: 10,
                                fontSize: "0.88rem",
                            }}
                        >
                            CHỌN LOẠI HỘP
                        </p>

                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                flexWrap: "wrap",
                            }}
                        >
                            {BOXES.map((b) => (
                                <button
                                    key={b.id}
                                    onClick={() => setBoxId(b.id)}
                                    style={{
                                        background: b.bg,
                                        color: b.textColor,
                                        border:
                                            boxId === b.id
                                                ? "3px solid #922b21"
                                                : "3px solid transparent",
                                        borderRadius: 12,
                                        padding: "0.6rem 1rem",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                    }}
                                >
                                    {b.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CUP POSITION */}

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 18,
                            padding: "1rem",
                            marginBottom: "1rem",
                            boxShadow: "0 2px 18px rgba(0,0,0,0.05)",
                        }}
                    >
                        <p
                            style={{
                                fontWeight: 800,
                                color: "#7b241c",
                                marginBottom: 10,
                                fontSize: "0.88rem",
                            }}
                        >
                            VỊ TRÍ LY NƯỚC
                        </p>

                        <div
                            style={{
                                display: "flex",
                                gap: 10,
                            }}
                        >
                            {["left", "center", "right"].map((pos) => (
                                <button
                                    key={pos}
                                    onClick={() => setCupPosition(pos)}
                                    style={{
                                        flex: 1,
                                        padding: "0.7rem",
                                        borderRadius: 12,
                                        border:
                                            cupPosition === pos
                                                ? "2px solid #922b21"
                                                : "2px solid #f8bbd9",
                                        background:
                                            cupPosition === pos
                                                ? "linear-gradient(135deg,#922b21,#e74c3c)"
                                                : "#fff",
                                        color:
                                            cupPosition === pos
                                                ? "#fff"
                                                : "#7b241c",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                    }}
                                >
                                    {pos === "left"
                                        ? "Bên Trái"
                                        : pos === "center"
                                            ? "Ở Giữa"
                                            : "Bên Phải"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CANVAS */}

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 20,
                            padding: "1rem",
                            boxShadow: "0 4px 28px rgba(192,57,43,0.10)",
                        }}
                    >
                        <div
                            ref={canvasRef}
                            onClick={() => setSelectedId(null)}
                            style={{
                                position: "relative",
                                width: "100%",
                                paddingBottom: isMobile ? "100%" : "70%",
                                background: box?.bg,
                                border: `5px solid ${box?.border}`,
                                borderRadius: 18,
                                overflow: "hidden",
                                touchAction: "none",
                            }}
                        >
                            {/* CUP ZONE */}

                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    left: `${CUP_POSITIONS[cupPosition]}%`,
                                    width: `${CUP_WIDTH}%`,
                                    background: "rgba(255,255,255,0.08)",
                                    borderLeft:
                                        "2px dashed rgba(255,255,255,0.5)",
                                    borderRight:
                                        "2px dashed rgba(255,255,255,0.5)",
                                    zIndex: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop"
                                    alt="cup"
                                    style={{
                                        width: "85%",
                                        height: "85%",
                                        objectFit: "cover",
                                        borderRadius: 20,
                                        opacity: 0.95,
                                        pointerEvents: "none",
                                    }}
                                />
                            </div>

                            {/* TEXTURE */}

                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    pointerEvents: "none",
                                    opacity: 0.04,
                                    backgroundImage:
                                        "repeating-linear-gradient(0deg,transparent,transparent 12px,rgba(0,0,0,1) 12px,rgba(0,0,0,1) 13px)",
                                }}
                            />

                            {/* EMPTY */}

                            {items.length === 0 && (
                                <div
                                    style={{
                                        position: "relative",
                                        inset: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textAlign: "center",
                                        color: "rgba(0,0,0,0.35)",
                                        padding: "1rem",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    Chọn sản phẩm bên phải để bắt đầu thiết kế
                                </div>
                            )}

                            {/* ITEMS */}

                            {items.map((item) => (
                                <CanvasItem
                                    key={item.uid}
                                    item={item}
                                    selected={selectedId === item.uid}
                                    onSelect={setSelectedId}
                                    onMove={moveItem}
                                    onDelete={deleteItem}
                                    canvasRef={canvasRef}
                                    isMobile={isMobile}
                                />
                            ))}
                        </div>

                        <p
                            style={{
                                fontSize: "0.74rem",
                                color: "#aaa",
                                marginTop: 10,
                                textAlign: "center",
                            }}
                        >
                            Không thể đặt vật phẩm lên vùng ly nước. <br />
                            Thiết kế chỉ mang tính minh họa, sản phẩm thực tế có thể khác biệt
                        </p>
                    </div>

                    {/* SAVE */}

                    <button
                        onClick={handleSave}
                        disabled={capturing}
                        style={{
                            width: "100%",
                            marginTop: "1.2rem",
                            background:
                                capturing
                                    ? "#ccc"
                                    : "linear-gradient(135deg,#7b241c,#c0392b,#e74c3c)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 50,
                            padding: "1.1rem",
                            fontSize: "1.1rem",
                            fontWeight: 800,
                            cursor: capturing ? "wait" : "pointer",
                            boxShadow:
                                "0 6px 24px rgba(192,57,43,0.38)",
                        }}
                    >
                        {capturing
                            ? "Đang lưu..."
                            : "Lưu Thiết Kế & Đặt Hàng"}
                    </button>
                </div>

                {/* RIGHT */}

                <div
                    style={{
                        background: "#fff",
                        borderRadius: 20,
                        padding: "1.2rem",
                        boxShadow: "0 4px 24px rgba(192,57,43,0.08)",
                        height: "fit-content",
                        position: isMobile ? "relative" : "sticky",
                        top: isMobile ? 0 : 80,
                    }}
                >
                    <p
                        style={{
                            fontWeight: 800,
                            color: "#7b241c",
                            textAlign: "center",
                            marginBottom: "1rem",
                        }}
                    >
                        KHO VẬT PHẨM
                    </p>

                    {/* TABS */}

                    <div
                        style={{
                            display: "flex",
                            gap: 5,
                            marginBottom: "1rem",
                            background: "#fff0f3",
                            borderRadius: 30,
                            padding: 4,
                        }}
                    >
                        {Object.keys(CATALOGUE).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                style={{
                                    flex: 1,
                                    padding: "0.5rem",
                                    border: "none",
                                    borderRadius: 30,
                                    cursor: "pointer",
                                    fontWeight: 700,
                                    background:
                                        category === cat
                                            ? "linear-gradient(135deg,#922b21,#e74c3c)"
                                            : "transparent",
                                    color:
                                        category === cat
                                            ? "#fff"
                                            : "#7b241c",
                                }}
                            >
                                {CATEGORY_LABELS[cat]}
                            </button>
                        ))}
                    </div>

                    {/* GRID */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 10,
                        }}
                    >
                        {CATALOGUE[category]?.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => addItem(item.id)}
                                style={{
                                    background:
                                        "linear-gradient(135deg,#fff8f9,#fce4ec)",
                                    border: "2px solid #f8bbd9",
                                    borderRadius: 14,
                                    padding: "0.8rem 0.5rem",
                                    cursor: "pointer",
                                }}
                            >
                                <img
                                    src={item.image}
                                    alt={item.label}
                                    style={{
                                        width: "100%",
                                        aspectRatio: "1/1",
                                        objectFit: "cover",
                                        borderRadius: 12,
                                        marginBottom: 8,
                                    }}
                                />

                                <div
                                    style={{
                                        fontSize: "0.74rem",
                                        fontWeight: 800,
                                        color: "#7b241c",
                                    }}
                                >
                                    {item.label}
                                </div>

                                {item.desc && (
                                    <div
                                        style={{
                                            fontSize: "0.65rem",
                                            color: "#999",
                                            marginTop: 3,
                                        }}
                                    >
                                        {item.desc}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}