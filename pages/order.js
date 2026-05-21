import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { MapPin } from "lucide-react";

export default function OrderPage() {
    const { cart, removeItem, clearCart, updateItem } = useCart();
    const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
    const [mapUrl, setMapUrl] = useState("");
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toppings, setToppings] = useState([]);
    const [warning, setWarning] = useState("");

    // Payment + modal states
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [deliveryMethod, setDeliveryMethod] = useState("DELIVERY"); // DELIVERY hoặc PICKUP
    const [showModal, setShowModal] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [bankOrderCode, setBankOrderCode] = useState("");

    // Ref để kiểm tra component còn mounted
    const isMounted = useRef(true);

    const SIZE_LEVELS = { S: 0, M: 5, L: 7, XL: 13 };

    // Cleanup khi component unmount
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

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

    // Hiển thị bản đồ
    useEffect(() => {
        if (form.address.trim() && deliveryMethod === "DELIVERY") {
            setMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(form.address)}&output=embed`);
        } else {
            setMapUrl("");
        }
    }, [form.address, deliveryMethod]);

    // Tính tổng tiền
    const subtotal = cart.reduce((sum, i) => {
        const basePrice = Number(i.price || 0);
        const upsizeCost = (Number(i.upsize || 0)) * (SIZE_LEVELS[i.size] || 0);
        const toppingTotal = (i.toppings || []).reduce((s, t) => s + (t.price || 0), 0);
        return sum + ((basePrice + upsizeCost + toppingTotal) * (i.qty || 1));
    }, 0);

    // Cập nhật số lượng
    const updateQty = (itemId, change) => {
        const item = cart.find((i) => i.uniqueId === itemId);
        if (!item) return;
        const newQty = Math.max(1, (item.qty || 1) + change);
        updateItem(itemId, { qty: newQty });
    };

    // Chọn / bỏ topping
    const toggleTopping = (itemId, topping) => {
        const item = cart.find((i) => i.uniqueId === itemId);
        if (!item) return;

        const exists = item.toppings?.some((tp) => tp.name === topping.name);

        if (!exists && (item.toppings?.length || 0) >= 3) {
            setWarning("Bạn chỉ được chọn tối đa 3 topping!");
            return;
        }

        const newToppings = exists
            ? item.toppings.filter((tp) => tp.name !== topping.name)
            : [...(item.toppings || []), topping];

        updateItem(itemId, { toppings: newToppings });
    };

    // Hàm gửi đơn
    async function sendOrder(customPaymentMethod = paymentMethod, orderCode = "") {
        setLoading(true);
        setStatus(null);
        try {
            const orderId = orderCode || Date.now().toString();
            const order = {
                customer: form,
                items: cart,
                total: subtotal,
                note: form.note || "",
                orderId,
                paymentMethod: customPaymentMethod,
                deliveryMethod: deliveryMethod,
                bankOrderCode: orderCode || "",
            };

            const res = await fetch("/api/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(order),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Lỗi khi gửi đơn.");

            setStatus({ ok: data?.message || "Đặt hàng thành công!" });
            clearCart();
            setForm({ name: "", phone: "", address: "", note: "" });
            setMapUrl("");
            return true;
        } catch (err) {
            setWarning(err.message || "Lỗi mạng. Thử lại.");
            return false;
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }

    // Gửi đơn hàng (form submit)
    async function submit(e) {
        e.preventDefault();
        setWarning("");
        setStatus(null);

        const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
        if (!nameRegex.test(form.name.trim())) {
            setWarning("Họ và tên không được chứa số hoặc ký tự đặc biệt.");
            return;
        }

        if (form.phone.length < 9 || form.phone.length > 11) {
            setWarning("Số điện thoại phải từ 9–11 số.");
            return;
        }

        if (cart.length === 0) {
            setWarning("Chưa chọn món nào.");
            return;
        }

        // Nếu giao hàng thì bắt buộc phải có địa chỉ
        if (deliveryMethod === "DELIVERY" && !form.address.trim()) {
            setWarning("Vui lòng nhập địa chỉ giao hàng.");
            return;
        }

        if (paymentMethod === "BANK") {
            const code = Date.now().toString().slice(-6);
            setBankOrderCode(code);
            setModalStep(1);
            setShowModal(true);
            return;
        }

        await sendOrder("COD");
    }

    // Hàm xác nhận đã chuyển khoản
    const handleConfirmTransfer = async () => {
        const success = await sendOrder("BANK", bankOrderCode);
        if (success && isMounted.current) {
            setShowModal(false);
            setModalStep(1);
            setBankOrderCode("");
        }
    };

    return (
        <section className="container py-10 max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-[#601C1F] mb-8 text-center">
                Đặt hàng
            </h1>

            {/* CART */}
            {cart.length > 0 ? (
                <div className="bg-white p-6 rounded-lg shadow space-y-3 mb-6">
                    <div className="font-medium mb-2">Món đã chọn</div>
                    {cart.map((item) => {
                        const currentItemUpsizeCost = (Number(item.upsize || 0)) * (SIZE_LEVELS[item.size] || 0);
                        const currentItemBaseTotal = (Number(item.price) + currentItemUpsizeCost) * item.qty;
                        return (
                            <div
                                key={item.uniqueId}
                                className="relative bg-white rounded-2xl p-4 shadow mb-4 pb-10"
                            >
                                <button
                                    onClick={() => removeItem(item.uniqueId)}
                                    className="absolute bottom-3 right-3 text-[#601C1F] hover:text-[#601C1F] text-sm"
                                >
                                    ❌
                                </button>

                                <div className="flex items-center gap-3 mb-3">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-lg object-cover border"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                                            ảnh
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h3 className="text-lg font-semibold">{item.name}</h3>
                                            <span className="text-gray-600 text-sm font-bold">
                                                {currentItemBaseTotal.toLocaleString()}₫
                                            </span>
                                        </div>
                                        {item.upsize > 0 && SIZE_LEVELS[item.size] > 0 && (
                                            <div className="text-xs text-amber-600">
                                                Size {item.size}: +{(item.upsize * SIZE_LEVELS[item.size]).toLocaleString()}₫
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQty(item.uniqueId, -1)}
                                                className="px-3 py-1 bg-gray-200 rounded-full text-lg"
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                value={item.qty}
                                                min="1"
                                                onChange={(e) =>
                                                    updateItem(item.uniqueId, {
                                                        qty: Math.max(1, Number(e.target.value)),
                                                    })
                                                }
                                                className="w-14 text-center border rounded-lg py-1"
                                            />
                                            <button
                                                onClick={() => updateQty(item.uniqueId, 1)}
                                                className="px-3 py-1 bg-gray-200 rounded-full text-lg"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Options: Đá, Đường, Size, Topping... */}
                                <div className="mb-2">
                                    <label className="block text-sm text-gray-600 mb-1">Mức đá:</label>
                                    <select
                                        value={item.ice || "bình thường"}
                                        onChange={(e) => updateItem(item.uniqueId, { ice: e.target.value })}
                                        className="border rounded-lg px-3 py-2 w-full"
                                    >
                                        <option value="không đá">Không cần lun</option>
                                        <option value="đá riêng">Để riêng đi</option>
                                        <option value="đá chung">Để chung luôn nha</option>
                                    </select>
                                </div>

                                <div className="mb-2">
                                    <label className="block text-sm text-gray-600 mb-1">Độ ngọt:</label>
                                    <select
                                        value={item.sweet || "bình thường"}
                                        onChange={(e) => updateItem(item.uniqueId, { sweet: e.target.value })}
                                        className="border rounded-lg px-3 py-2 w-full"
                                    >
                                        <option value="không đường">không nước đường, trừ calo trong mô tả</option>
                                        <option value="đường riêng">để riêng đường, tui tự thêm theo ý tui</option>
                                        <option value="ít ngọt">ít ngọt thui - giảm 33 calo</option>
                                        <option value="bình thường">tiệm đang như thế nào thì để như vị nha</option>
                                        <option value="ngọt nhiều">ngọt nữa, toi thích ngọt - thêm 60 calo</option>
                                        <option value="siêu ngọt">siêuuuuuuu ngọt - thêm 120 calo</option>
                                    </select>
                                </div>

                                <div className="mb-2">
                                    <label className="block text-sm text-gray-600 mb-1">Cỡ:</label>
                                    <select
                                        value={item.size || "S"}
                                        onChange={(e) => updateItem(item.uniqueId, { size: e.target.value })}
                                        className="border rounded-lg px-3 py-2 w-full"
                                    >
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm text-gray-600 mb-1">Topping:</label>

                                    {["k", "t", "h"].map((type) => {
                                        let typeName = "";
                                        if (type === "k") typeName = "Kem";
                                        else if (type === "t") typeName = "Thạch";
                                        else if (type === "h") typeName = "Hạt";

                                        const list = toppings.filter((t) => t.id.startsWith(type));
                                        if (list.length === 0) return null;

                                        return (
                                            <div key={typeName} className="mb-2">
                                                <div className="text-xs font-semibold mb-1">{typeName}:</div>
                                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide cursor-grab select-none">
                                                    {list.map((t) => {
                                                        const isSelected = item.toppings?.some((tp) => tp.name === t.name);
                                                        return (
                                                            <button
                                                                key={t.name}
                                                                type="button"
                                                                onClick={() => toggleTopping(item.uniqueId, t)}
                                                                className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium ${isSelected
                                                                    ? "bg-green-500 text-white border-green-500"
                                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
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
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Ghi chú:</label>
                                    <textarea
                                        value={item.itemNote || ""}
                                        onChange={(e) => updateItem(item.uniqueId, { itemNote: e.target.value })}
                                        placeholder="Ví dụ: ít đá, không topping..."
                                        className="border rounded-lg px-3 py-2 w-full resize-none"
                                    />
                                </div>
                            </div>
                        )
                    })}

                    <div className="text-right font-semibold mt-3 text-xl text-amber-600">
                        Tổng: {subtotal.toLocaleString()} ₫
                    </div>
                </div>
            ) : (
                <div className="text-center text-slate-500 mb-6">Chưa có món nào trong giỏ hàng.</div>
            )}

            {/* FORM THÔNG TIN */}
            <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Họ và tên"
                        className="border p-2 rounded w-full"
                    />
                    <input
                        required
                        value={form.phone}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 11) setForm({ ...form, phone: value });
                        }}
                        placeholder="Số điện thoại"
                        className="border p-2 rounded w-full"
                    />
                </div>

                {/* DELIVERY METHOD SELECTION */}
                <div className="space-y-2 text-sm text-slate-600">
                    <div className="font-medium">Hình thức nhận hàng:</div>
                    <div className="flex gap-4 mt-1 items-center">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="radio"
                                name="delivery"
                                value="DELIVERY"
                                checked={deliveryMethod === "DELIVERY"}
                                onChange={() => setDeliveryMethod("DELIVERY")}
                            />
                            <span>Giao hàng tận nơi</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="radio"
                                name="delivery"
                                value="PICKUP"
                                checked={deliveryMethod === "PICKUP"}
                                onChange={() => {
                                    setDeliveryMethod("PICKUP");
                                    setForm({ ...form, address: "" }); // Clear địa chỉ khi chọn pickup
                                }}
                            />
                            <span>Đến tận nơi để lấy</span>
                        </label>
                    </div>
                </div>

                {/* ADDRESS - Only show if DELIVERY */}
                {deliveryMethod === "DELIVERY" && (
                    <div className="space-y-2">
                        <div className="relative flex items-center">
                            <input
                                required
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                placeholder="Địa chỉ giao hàng"
                                className="border p-2 rounded w-full pr-10"
                            />
                            {form.address && (
                                <a
                                    href={`https://www.google.com/maps/search/${encodeURIComponent(form.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute right-2 text-amber-600 hover:text-amber-800"
                                    title="Mở bản đồ"
                                >
                                    <MapPin className="w-5 h-5" />
                                </a>
                            )}
                        </div>

                        {mapUrl && (
                            <div className="rounded overflow-hidden border border-gray-300 shadow-sm">
                                <iframe
                                    src={mapUrl}
                                    width="100%"
                                    height="200"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                ></iframe>
                            </div>
                        )}
                    </div>
                )}

                {/* PICKUP INFO - BRANCH SELECTION */}
                {deliveryMethod === "PICKUP" && (
                    <div className="space-y-3">
                        <div className="font-medium text-sm text-slate-600">Chọn chi nhánh lấy hàng:</div>

                        {/* Branch 1 */}
                        <label className="block cursor-pointer">
                            <input
                                type="radio"
                                name="branch"
                                value="branch1"
                                checked={form.address === "Chi nhánh 1"}
                                onChange={() => setForm({ ...form, address: "Chi nhánh 1" })}
                                className="sr-only peer"
                            />
                            <div className="bg-white border-2 border-gray-300 peer-checked:border-[#601C1F] peer-checked:bg-red-50 rounded-lg p-4 text-sm transition">
                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-[#601C1F] peer-checked:bg-[#601C1F] flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {form.address === "Chi nhánh 1" && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-800 mb-1">Chi nhánh 1</div>
                                        <p className="font-bold text-gray-700 mb-1">Cocanut - Đọc là Cô ca nất</p>
                                        <p className="text-gray-600 text-xs">202/17A Phạm Văn Hai, Phường Tân Sơn Nhất, TP. Hồ Chí Minh</p>
                                        <p className="text-gray-600 text-xs mt-2">09:00 - 17:00 (T2 - T7)</p>
                                    </div>
                                </div>
                            </div>
                        </label>

                        {/* Branch 2 */}
                        <label className="block cursor-pointer">
                            <input
                                type="radio"
                                name="branch"
                                value="branch2"
                                checked={form.address === "Chi nhánh 2"}
                                onChange={() => setForm({ ...form, address: "Chi nhánh 2" })}
                                className="sr-only peer"
                            />
                            <div className="bg-white border-2 border-gray-300 peer-checked:border-[#601C1F] peer-checked:bg-red-50 rounded-lg p-4 text-sm transition">
                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-[#601C1F] peer-checked:bg-[#601C1F] flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {form.address === "Chi nhánh 2" && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-800 mb-1">Chi nhánh 2</div>
                                        <p className="font-bold text-gray-700 mb-1">COCANUT LONG THÀNH</p>
                                        <p className="text-gray-600 text-xs">Lý Tự Trọng, Thị trấn Long Thành, Huyện Long Thành, Đồng Nai</p>
                                        <p className="text-gray-600 text-xs mt-2">07:30 - 22:00 (T2 - CN)</p>
                                    </div>
                                </div>
                            </div>
                        </label>
                    </div>
                )}

                <textarea
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="Ghi chú chung (tuỳ chọn)"
                    className="border p-2 rounded w-full"
                    rows="3"
                />

                {/* PAYMENT SELECTION */}
                <div className="space-y-2 text-sm text-slate-600">
                    <div className="font-medium">Hình thức thanh toán:</div>
                    <div className="flex gap-4 mt-1 items-center">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="radio"
                                name="payment"
                                value="COD"
                                checked={paymentMethod === "COD"}
                                onChange={() => setPaymentMethod("COD")}
                            />
                            <span>Thanh toán khi nhận hàng (COD)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="radio"
                                name="payment"
                                value="BANK"
                                checked={paymentMethod === "BANK"}
                                onChange={() => setPaymentMethod("BANK")}
                            />
                            <span>Chuyển khoản</span>
                        </label>
                    </div>
                </div>

                <div className="flex flex-col mt-3">
                    <button
                        disabled={loading}
                        className="bg-[#601C1F] disabled:opacity-50 text-white px-4 py-2 rounded self-end hover:bg-[#601C1F] transition"
                    >
                        {loading ? "Đang gửi..." : "Gửi đơn"}
                    </button>

                    {warning && (
                        <div className="flex items-center gap-2 text-[#601C1F] text-sm mt-3">
                            ⚠️ {warning}
                        </div>
                    )}
                </div>

                {status?.error && <div className="text-[#601C1F]">{status.error}</div>}
                {status?.ok && <div className="text-green-600">{status.ok}</div>}
            </form>

            {/* PAYMENT MODAL - REDESIGNED */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#601C1F] to-[#601C1F] px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 rounded-full p-2">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Chuyển khoản ngân hàng</h3>
                                    <p className="text-xs text-red-100">Vui lòng chuyển khoản để hoàn tất đơn hàng</p>
                                </div>
                            </div>
                            <button
                                onClick={() => !loading && setShowModal(false)}
                                className="text-white/80 hover:text-white text-2xl leading-none transition"
                                disabled={loading}
                            >
                                ×
                            </button>
                        </div>

                        {/* Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                            {/* QR Code Section */}
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 text-center">
                                <div className="inline-block bg-white p-4 rounded-xl shadow-lg mb-4">
                                    <img
                                        src={`https://img.vietqr.io/image/MB-0977865733-compact2.jpg?amount=${subtotal}&addInfo=${encodeURIComponent(`${form.name} ${form.phone} ${bankOrderCode}`)}&accountName=${encodeURIComponent('BUI LONG ANH DUY')}`}
                                        alt="QR Code"
                                        className="w-64 h-64 object-contain"
                                    />
                                </div>
                                <p className="text-sm text-gray-600 font-medium">
                                    Quét mã QR bằng app ngân hàng
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Thông tin chuyển khoản đã được điền sẵn
                                </p>
                            </div>

                            {/* Bank Info */}
                            <div className="bg-white border-2 border-red-100 rounded-xl p-5 space-y-3">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-[#601C1F]" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h4 className="font-bold text-gray-800">Thông tin chuyển khoản</h4>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Ngân hàng:</span>
                                        <span className="font-semibold text-gray-800">MB NGÂN HÀNG QUÂN ĐỘI (MB)</span>
                                    </div>

                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Chủ tài khoản:</span>
                                        <span className="font-semibold text-gray-800">BUI LONG ANH DUY</span>
                                    </div>

                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Số tài khoản:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg text-[#601C1F] tracking-wider">0977865733</span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText('0977865733');
                                                    alert('Đã copy số tài khoản!');
                                                }}
                                                className="text-[#601C1F] hover:text-[#601C1F]"
                                                title="Copy số tài khoản"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Số tiền:</span>
                                        <span className="font-bold text-xl text-[#601C1F]">{subtotal.toLocaleString()}₫</span>
                                    </div>
                                </div>
                            </div>

                            {/* Transfer Content */}
                            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
                                <div className="flex items-start gap-2 mb-3">
                                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="font-bold text-amber-800 mb-1">Nội dung chuyển khoản:</p>
                                        <p className="text-xs text-amber-700 mb-2">
                                            Vui lòng nhập chính xác nội dung bên dưới
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-4 border-2 border-amber-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <code className="text-sm font-bold text-gray-800 break-all">
                                            {form.name} {form.phone} {bankOrderCode}
                                        </code>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${form.name} ${form.phone} ${bankOrderCode}`);
                                                alert('Đã copy nội dung chuyển khoản!');
                                            }}
                                            className="ml-2 text-[#601C1F] hover:text-[#601C1F] flex-shrink-0"
                                            title="Copy nội dung"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-xs text-amber-600">
                                        Sai nội dung sẽ làm chậm quá trình xử lý đơn hàng
                                    </p>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                                <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                                    Hướng dẫn
                                </h4>
                                <ol className="space-y-2 text-sm text-blue-900">
                                    <li className="flex gap-2">
                                        <span className="font-bold">1.</span>
                                        <span>Mở app ngân hàng và quét mã QR phía trên</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-bold">2.</span>
                                        <span>Kiểm tra thông tin và số tiền đã đúng</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-bold">3.</span>
                                        <span>Xác nhận chuyển khoản</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-bold">4.</span>
                                        <span>Nhấn nút "Tôi đã chuyển khoản" bên dưới</span>
                                    </li>
                                </ol>
                            </div>

                        </div>

                        {/* Footer Actions */}
                        <div className="border-t bg-gray-50 p-6 space-y-3">
                            <button
                                onClick={handleConfirmTransfer}
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition transform ${loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 active:scale-95"
                                    }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Đang xử lý...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        ✓ Tôi đã chuyển khoản
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => !loading && setShowModal(false)}
                                disabled={loading}
                                className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium transition disabled:opacity-50"
                            >
                                Huỷ bỏ
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </section>
    );
}