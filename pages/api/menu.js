import Papa from "papaparse";

export default async function handler(req, res) {
    const sheetId = process.env.SHEET_ID;
    const gid = process.env.SHEET_GID || 0;
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`Google Sheets returned ${resp.status}`);
        const csvText = await resp.text();

        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

        const data = parsed.data.map((row, idx) => {
            const rawDesc = (row.description || row.mota || "").toString().trim().toLowerCase();

            return {
                id: row.id || `item-${idx}`,
                name: row.name || "Không tên",
                price: Number(row.price || 0),
                upsize: Number(row.upsize || 0),
                image: row.image || "",
                description: rawDesc,
                special: row.special || ""
            };
        });

        res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching sheet:", err);
        res.status(500).json({
            error: "Không thể tải menu",
            details: err.message,
        });
    }
}
