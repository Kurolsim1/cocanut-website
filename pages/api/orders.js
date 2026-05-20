// pages/api/orders.js
import Papa from 'papaparse';

export default async function handler(req, res) {
    const sheetId = process.env.SHEET_HISTORY_ID;
    const gid = process.env.SHEET_HISTORY_GID || '0';

    if (!sheetId) {
        return res.status(500).json({ message: 'Thiếu cấu hình sheet ID' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ message: 'Số điện thoại không được để trống' });
    }

    try {
        const SHEET_URL =
            `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

        const response = await fetch(SHEET_URL);
        if (!response.ok) {
            throw new Error(`Google Sheets error: ${response.status}`);
        }

        const csvText = await response.text();

        // Parse CSV bằng papaparse: hỗ trợ multi-line + quotes + dấu phẩy
        const parsed = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true
        });

        const rows = parsed.data;

        const results = rows.filter(row => row.Phone?.trim() === phone.trim())
            .map(row => ({
                name: row["Name"] || '',
                phone: row["Phone"] || '',
                address: row["Address"] || '',
                drinks: row["Drinks"] || '',
                total: row["Total"] || '0',
                paymentStatus: row["Trạng thái thanh toán"] || '',
                note: row["Note"] || '',
                timestamp: row["Thời gian đặt hàng"] || '',
                orderId: row["Mã đơn"] || ''
            }));

        return res.status(200).json({
            orders: results,
            total: results.length
        });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({
            message: 'Lỗi khi tra cứu đơn hàng'
        });
    }
}
