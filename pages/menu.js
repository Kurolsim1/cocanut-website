import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { Search } from "lucide-react";

export default function Menu() {
    const { addItem } = useCart();
    const [menu, setMenu] = useState([]);
    const [toppings, setToppings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [toast, setToast] = useState(null);
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [custom, setCustom] = useState({
        qty: 1,
        ice: "đá chung",
        sweet: "ngọt vừa",
        size: "S",
        toppings: [],
        itemNote: "",
        error: "",
    });
    const SIZE_LEVELS = { S: 0, M: 5, L: 7, XL: 13 };

    const REFRESH_INTERVAL = 1 * 60 * 1000;


    // Định nghĩa categories dựa vào database ID
    const CATEGORIES = [
        { id: "all", name: "Tất cả", prefix: "" },
        { id: "cafe", name: "Café - cà phê", prefix: "caf" },
        { id: "cacao", name: "Intense cocoa - cacao", prefix: "cac" },
        { id: "chocolate", name: "Chocolate latte", prefix: "cho" },
        { id: "coco", name: "Cocowater - nước dừa", prefix: "coc" },
        { id: "matcha", name: "Matcha - mật trà", prefix: "mat" },
        { id: "coldbrew", name: "Cold brew tea - trà ủ lạnh", prefix: "col" },
        { id: "seasonal", name: "🎄 Seasonal", prefix: "seasonal" },
        { id: "best", name: "⭐ Best Seller", prefix: "best" }
    ];

    // Tải menu từ Google Sheets
    async function loadMenu(showLoading = true) {
        try {
            if (showLoading) setLoading(true);
            const res = await fetch("/api/menu?" + Date.now());
            if (!res.ok) throw new Error("Không thể tải menu");
            const data = await res.json();
            setMenu(data);
            setError(null);
        } catch (err) {
            console.error("Lỗi load menu:", err);
            setError("Lỗi khi tải danh sách món ăn");
        } finally {
            if (showLoading) setLoading(false);
        }
    }

    // Lấy danh sách topping
    useEffect(() => {
        async function fetchToppings() {
            try {
                const res = await fetch("/api/toppings");
                const data = await res.json();
                if (Array.isArray(data)) setToppings(data);
            } catch (err) {
                console.error("Error fetching toppings:", err);
            }
        }
        fetchToppings();
    }, []);

    // Lần đầu load menu
    useEffect(() => {
        loadMenu();
    }, []);

    // Làm mới menu định kỳ
    useEffect(() => {
        const interval = setInterval(() => {
            console.log("🔄 Làm mới menu từ Google Sheets...");
            loadMenu(false);
        }, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    // Khi bấm chọn món → mở popup
    const handleAdd = (item) => {
        const desc = (item.description || "").toLowerCase().trim();
        if (desc === "hết") return;
        setSelectedItem(item);
        setCustom({
            qty: 1,
            ice: "đá chung",
            sweet: "ngọt vừa",
            size: "S",
            toppings: [],
            itemNote: "",
            error: "",
        });
    };

    // Xác nhận thêm món vào giỏ
    const confirmAdd = () => {
        if (custom.toppings.length > 3) {
            setCustom({
                ...custom,
                error: "Bạn chỉ được chọn tối đa 3 topping!",
            });
            return;
        }

        addItem({
            ...selectedItem,
            ...custom,
            upsize: selectedItem.upsize || 0
        });

        setSelectedItem(null);

        // Hiển thị toast thành công
        setToast({
            type: "success",
            message: `Đã thêm "${selectedItem.name}" vào giỏ hàng!`,
        });

        setTimeout(() => setToast(null), 2500);
    };

    const calculatePopupPrice = () => {
        if (!selectedItem) return 0;
        const basePrice = Number(selectedItem.price);
        const upsizePrice = Number(selectedItem.upsize || 0);
        const level = SIZE_LEVELS[custom.size] || 0;
        return basePrice + (upsizePrice * level);
    };

    // Filter menu dựa vào category và search
    const getCategoryPrefix = (categoryId) => {
        const cat = CATEGORIES.find(c => c.id === categoryId);
        return cat?.prefix || "";
    };

    const filteredMenu = menu.filter(item => {
        const prefix = getCategoryPrefix(activeCategory);

        // Kiểm tra category
        let matchCategory = false;
        if (activeCategory === "all") {
            matchCategory = true;
        } else if (activeCategory === "seasonal") {
            matchCategory = (item.special || "").toLowerCase() === "seasonal";
        } else if (activeCategory === "best") {
            matchCategory = (item.special || "").toLowerCase() === "best";
        } else {
            matchCategory = item.id.toLowerCase().startsWith(prefix);
        }

        // Kiểm tra search
        const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchCategory && matchSearch;
    });

    return (
        <section className="container py-10 max-w-6xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-[#601C1F] mb-8 text-center">
                Thực đơn Cocanut
            </h1>

            {loading && (
                <div className="text-center text-slate-500 py-12 flex flex-col items-center gap-3">
                    <img
                        src="/images/cocanut-loading.png"
                        className="animate-spin w-8 h-8 md:w-10 md:h-10"
                    />
                    <span>Đang tải menu...</span>
                </div>
            )}

            {error && (
                <div className="text-center text-[#601C1F] py-12 bg-red-50 rounded-lg">
                    {error}
                </div>
            )}

            {/* Toast thông báo */}
            {toast && (
                <div
                    className={`fixed top-5 right-5 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg z-50 text-white text-sm animate-fade-in ${toast.type === "success" ? "bg-green-500" : "bg-[#601C1F]"
                        }`}
                >
                    {toast.type === "success" ? "✓" : "✕"} {toast.message}
                </div>
            )}

            {!loading && !error && (
                <>
                    {/* Search Bar */}
                    <div className="mb-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-red-200 rounded-full focus:outline-none focus:border-[#601C1F] transition"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-8 overflow-x-auto pb-2">
                        <div className="flex gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition whitespace-nowrap ${activeCategory === cat.id
                                        ? "bg-[#601C1F] text-white shadow-md"
                                        : "bg-white text-gray-700 border-2 border-gray-300 hover:border-[#601C1F]"
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results count */}
                    <div className="mb-6 text-sm text-gray-600">
                        Tìm thấy <span className="font-semibold text-[#601C1F]">{filteredMenu.length}</span> sản phẩm
                    </div>

                    {/* Menu Grid */}
                    {filteredMenu.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 auto-rows-max">
                            {filteredMenu.map((item) => {
                                const desc = (item.description || "").toLowerCase().trim();
                                const isOut = desc === "hết";

                                return (
                                    <div
                                        key={item.id}
                                        className={`p-4 rounded-xl border-2 bg-white shadow-sm hover:shadow-md transition-all flex flex-col ${isOut
                                            ? "opacity-60 border-gray-200"
                                            : "hover:border-[#601C1F] border-gray-200"
                                            }`}
                                    >
                                        {/* Image */}
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-40 object-cover rounded-lg mb-3"
                                            />
                                        )}

                                        {/* Info */}
                                        <div className="flex flex-col flex-1">
                                            <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2">
                                                {item.name}
                                            </h3>
                                            <div className="flex items-center justify-between mb-3 mt-auto">
                                                <span className="text-lg font-bold text-[#601C1F]">
                                                    {item.price ? Number(item.price).toLocaleString() : "0"} ₫
                                                </span>
                                                <span
                                                    className={`text-xs font-semibold px-2 py-1 rounded-full ${isOut
                                                        ? "bg-red-100 text-[#601C1F]"
                                                        : "bg-green-100 text-green-600"
                                                        }`}
                                                >
                                                    {isOut ? "Hết" : "Còn"}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => handleAdd(item)}
                                                disabled={isOut}
                                                className={`w-full py-2 rounded-lg font-medium text-sm transition ${isOut
                                                    ? "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-100"
                                                    : "bg-[#601C1F] hover:bg-red-700 text-white"
                                                    }`}
                                            >
                                                {isOut ? "Hết rồi" : "Chọn"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">Không tìm thấy sản phẩm nào</p>
                            <p className="text-sm">Thử tìm kiếm với từ khóa khác</p>
                        </div>
                    )}
                </>
            )}

            {/* Popup Tuỳ chỉnh món */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] flex flex-col relative">
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 z-10 text-2xl"
                        >
                            ✕
                        </button>

                        {/* Scrollable content */}
                        <div className="overflow-y-auto flex-1 p-6">
                            {/* Thông tin món*/}
                            <div className="flex gap-4 items-center mb-4">
                                {selectedItem.image && (
                                    <img
                                        src={selectedItem.image}
                                        alt={selectedItem.name}
                                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                    />
                                )}
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold">
                                        {selectedItem.name}
                                    </h2>
                                    <p className="text-[#601C1F] font-bold text-xl">
                                        {calculatePopupPrice().toLocaleString()} ₫
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Gốc: {Number(selectedItem.price).toLocaleString()} ₫
                                    </p>
                                </div>
                            </div>

                            {/* Số lượng */}
                            <div className="mb-3">
                                <label className="block text-sm text-gray-600 mb-1">
                                    Số lượng:
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={custom.qty}
                                    onChange={(e) =>
                                        setCustom({ ...custom, qty: Math.max(1, Number(e.target.value)) })
                                    }
                                    className="border rounded-lg px-3 py-2 w-full"
                                />
                            </div>

                            {/* Mức đá */}
                            <div className="mb-3">
                                <label className="block text-sm text-gray-600 mb-1">
                                    Mức đá:
                                </label>
                                <select
                                    value={custom.ice}
                                    onChange={(e) =>
                                        setCustom({ ...custom, ice: e.target.value })
                                    }
                                    className="border rounded-lg px-3 py-2 w-full"
                                >
                                    <option value="không đá">Không cần lun</option>
                                    <option value="đá riêng">Để riêng đi</option>
                                    <option value="đá chung">Để chung luôn nha</option>
                                </select>
                            </div>

                            {/* Độ ngọt */}
                            <div className="mb-3">
                                <label className="block text-sm text-gray-600 mb-1">
                                    Độ ngọt:
                                </label>
                                <select
                                    value={custom.sweet}
                                    onChange={(e) =>
                                        setCustom({ ...custom, sweet: e.target.value })
                                    }
                                    className="border rounded-lg px-3 py-2 w-full"
                                >
                                    <option value="không đường">không nước đường, trừ calo trong mô tả</option>
                                    <option value="đường riêng">để riêng đường, tui tự thêm theo ý tui</option>
                                    <option value="ít ngọt">ít ngọt thui - giảm 33 calo</option>
                                    <option value="ngọt vừa">tiệm đang như thế nào thì để như vị nha</option>
                                    <option value="ngọt nhiều">ngọt nữa, toi thích ngọt - thêm 60 calo</option>
                                    <option value="siêu ngọt">siêuuuuuuu ngọt - thêm 120 calo</option>
                                </select>
                            </div>

                            {/* Cỡ */}
                            <div className="mb-3">
                                <label className="block text-sm text-gray-600 mb-1">
                                    Cỡ:
                                </label>
                                <select
                                    value={custom.size}
                                    onChange={(e) =>
                                        setCustom({ ...custom, size: e.target.value })
                                    }
                                    className="border rounded-lg px-3 py-2 w-full"
                                >
                                    <option value="S">S (mặc định)</option>
                                    <option value="M">M (+50% dung tích)</option>
                                    <option value="L">L (+100% dung tích)</option>
                                    <option value="XL">XL (+200% dung tích)</option>
                                </select>
                            </div>

                            {/* Topping */}
                            {toppings.length > 0 && (
                                <div className="mb-3">
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Topping (tối đa 3):
                                    </label>

                                    {["k", "t", "h"].map((type) => {
                                        const typeName = type === "k" ? "Kem" : type === "t" ? "Thạch" : "Hạt/Khác";
                                        const list = toppings.filter((t) => t.id.startsWith(type));
                                        if (list.length === 0) return null;

                                        return (
                                            <div key={typeName} className="mb-2">
                                                <div className="text-xs font-semibold mb-1">{typeName}:</div>
                                                <div
                                                    className="flex gap-2 pb-2 overflow-x-auto select-none cursor-grab"
                                                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                                    onMouseDown={(e) => {
                                                        const el = e.currentTarget;
                                                        el.isDown = true;
                                                        el.startX = e.pageX - el.offsetLeft;
                                                        el.scrollLeftStart = el.scrollLeft;
                                                    }}
                                                    onMouseLeave={(e) => { e.currentTarget.isDown = false; }}
                                                    onMouseUp={(e) => { e.currentTarget.isDown = false; }}
                                                    onMouseMove={(e) => {
                                                        const el = e.currentTarget;
                                                        if (!el.isDown) return;
                                                        e.preventDefault();
                                                        const x = e.pageX - el.offsetLeft;
                                                        const walk = (x - el.startX) * 1.5;
                                                        el.scrollLeft = el.scrollLeftStart - walk;
                                                    }}
                                                >
                                                    {list.map((t) => {
                                                        const selected = custom.toppings.some((tp) => tp.name === t.name);
                                                        return (
                                                            <button
                                                                key={t.name}
                                                                onClick={() => {
                                                                    const exists = custom.toppings.some((tp) => tp.name === t.name);
                                                                    let newToppings;
                                                                    if (exists) {
                                                                        newToppings = custom.toppings.filter((tp) => tp.name !== t.name);
                                                                    } else {
                                                                        if (custom.toppings.length >= 3) {
                                                                            setCustom({
                                                                                ...custom,
                                                                                error: "Bạn chỉ được chọn tối đa 3 topping!",
                                                                            });
                                                                            return;
                                                                        }
                                                                        newToppings = [...custom.toppings, t];
                                                                    }
                                                                    setCustom({ ...custom, toppings: newToppings, error: "" });
                                                                }}
                                                                className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm transition ${selected
                                                                    ? "bg-green-500 text-white border-green-500"
                                                                    : "bg-white text-gray-700 border-gray-300"
                                                                    }`}
                                                            >
                                                                {t.name}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {custom.error && (
                                        <div className="flex items-center gap-2 text-[#601C1F] text-sm mt-2">
                                            ⚠️ {custom.error}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Ghi chú */}
                            <div className="mb-3">
                                <label className="block text-sm text-gray-600 mb-1">
                                    Ghi chú:
                                </label>
                                <textarea
                                    value={custom.itemNote}
                                    onChange={(e) =>
                                        setCustom({ ...custom, itemNote: e.target.value })
                                    }
                                    placeholder="Ví dụ: ít đá, thêm sữa, không topping..."
                                    className="border rounded-lg px-3 py-2 w-full resize-none"
                                    rows="3"
                                />
                            </div>
                        </div>

                        {/* Fixed button at bottom */}
                        <div className="border-t p-6 bg-white rounded-b-2xl">
                            <button
                                onClick={confirmAdd}
                                className="bg-[#601C1F] hover:bg-red-700 text-white px-4 py-3 rounded-lg w-full font-bold transition"
                            >
                                Thêm vào giỏ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}