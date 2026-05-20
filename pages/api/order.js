export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const response = await fetch(process.env.GAS_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(req.body),
            });

            if (!response.ok) throw new Error("Google Script lỗi");

            const data = await response.json();
            res.status(200).json({ message: "Đơn hàng gửi thành công", data });
        } catch (err) {
            console.error("Lỗi API:", err);
            res.status(500).json({ message: "Lỗi gửi đơn hàng" });
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
