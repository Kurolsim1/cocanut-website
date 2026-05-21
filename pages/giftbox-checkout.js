import { useEffect, useState } from "react";

export default function GiftboxCheckoutPage() {
    const [preview, setPreview] = useState(null);

    const [sending, setSending] = useState(false);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        message: "",
    });

    useEffect(() => {
        const data = localStorage.getItem("giftbox_design");

        if (!data) return;

        try {
            const parsed = JSON.parse(data);

            if (parsed?.preview) {
                setPreview(parsed.preview);
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSending(true);

        try {
            const designData = localStorage.getItem("giftbox_design");

            const body = {
                customer: form,
                design: JSON.parse(designData || "{}"),
                preview,
            };

            const res = await fetch("/api/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                alert("Đặt hàng thành công!");

                window.location.href = "/";
            } else {
                alert("Có lỗi xảy ra.");
            }
        } catch (err) {
            console.error(err);

            alert("Có lỗi xảy ra.");
        }

        setSending(false);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(160deg,#fff5f7,#fce4ec 60%,#fff9f0)",
                padding: "2rem 1rem",
            }}
        >
            <div
                style={{
                    maxWidth: 1000,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(320px,1fr))",
                    gap: "2rem",
                }}
            >
                {/* LEFT */}

                <div>
                    <h1
                        style={{
                            color: "#922b21",
                            marginBottom: "1rem",
                        }}
                    >
                        Xác Nhận Thiết Kế
                    </h1>

                    {preview && (
                        <img
                            src={preview}
                            alt="preview"
                            style={{
                                width: "100%",
                                borderRadius: 20,
                                border: "3px solid #f8bbd9",
                                boxShadow:
                                    "0 10px 30px rgba(192,57,43,0.18)",
                            }}
                        />
                    )}
                    {!preview && (
                        <div
                            style={{
                                height: 400,
                                borderRadius: 20,
                                border: "3px dashed #f8bbd9",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#999",
                                background: "#fff",
                            }}
                        >
                            Không tìm thấy thiết kế
                        </div>
                    )}
                </div>

                {/* RIGHT */}

                <form
                    onSubmit={handleSubmit}
                    style={{
                        background: "#fff",
                        borderRadius: 24,
                        padding: "1.5rem",
                        boxShadow: "0 4px 24px rgba(192,57,43,0.10)",
                    }}
                >
                    <h2
                        style={{
                            color: "#922b21",
                            marginTop: 0,
                        }}
                    >
                        Thông Tin Thanh Toán
                    </h2>

                    {[
                        {
                            label: "Họ và Tên",
                            key: "name",
                        },
                        {
                            label: "Số Điện Thoại",
                            key: "phone",
                        },
                        {
                            label: "Địa Chỉ",
                            key: "address",
                        },
                    ].map((f) => (
                        <div
                            key={f.key}
                            style={{
                                marginBottom: "1rem",
                            }}
                        >
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: 6,
                                    fontWeight: 700,
                                    color: "#7b241c",
                                }}
                            >
                                {f.label}
                            </label>

                            <input
                                required
                                value={form[f.key]}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        [f.key]: e.target.value,
                                    })
                                }
                                style={{
                                    width: "100%",
                                    padding: "0.85rem 1rem",
                                    borderRadius: 12,
                                    border: "2px solid #f8bbd9",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>
                    ))}

                    <div
                        style={{
                            marginBottom: "1.5rem",
                        }}
                    >
                        <label
                            style={{
                                display: "block",
                                marginBottom: 6,
                                fontWeight: 700,
                                color: "#7b241c",
                            }}
                        >
                            Ghi Chú
                        </label>

                        <textarea
                            rows={4}
                            value={form.message}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    message: e.target.value,
                                })
                            }
                            style={{
                                width: "100%",
                                padding: "1rem",
                                borderRadius: 12,
                                border: "2px solid #f8bbd9",
                                resize: "vertical",
                                outline: "none",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={sending}
                        style={{
                            width: "100%",
                            border: "none",
                            borderRadius: 50,
                            padding: "1rem",
                            fontWeight: 800,
                            fontSize: "1rem",
                            cursor: "pointer",
                            color: "#fff",
                            background:
                                "linear-gradient(135deg,#922b21,#e74c3c)",
                        }}
                    >
                        {sending
                            ? "Đang xử lý..."
                            : "Xác Nhận Thanh Toán"}
                    </button>
                </form>
            </div>
        </div>
    );
}