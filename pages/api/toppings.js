import Papa from "papaparse";

export default async function handler(req, res) {
    const sheetId = process.env.SHEET_ID;
    const gid = process.env.SHEET_TOP_GID || 1; // sheet thứ 2
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`Google Sheets returned ${resp.status}`);
        const csvText = await resp.text();

        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

        const data = parsed.data.map((row, idx) => ({
            id: row.id || `topping-${idx}`,
            name: row.name,
            price: Number(row.price || 0),
        }));

        res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching toppings:", err);
        res.status(500).json({ error: "Không thể tải topping", details: err.message });
    }
}
