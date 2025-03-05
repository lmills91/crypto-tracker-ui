import React, { useEffect, useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { useGetTradeData } from "../hooks/useGetTradeData";

interface CsvRow {
  [key: string]: string | number;
}

export default function DataTable() {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
    const [sortedData, setSortedData] = useState<CsvRow[]>([]);
    const { data } = useGetTradeData("/data/trade_log.csv");
    
    useEffect(() => {
        if (data) {
            setSortedData(data);
        }
    }, [data]);

    const handleSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
        }

        const sortedData = [...data].sort((a, b) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
        });

        setSortedData(sortedData);
        setSortConfig({ key, direction });
    };  

    return (
        <div style={{ padding: "16px" }}>
        <h2>Crypto Trade Log Data</h2>
        {sortedData.length > 0 ? (
            <table border={1} style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr>
                {Object.keys(sortedData[0]).map((key) => (
                    <th
                    key={key}
                    onClick={() => handleSort(key)}
                    style={{
                        padding: "8px",
                        background: "#333",
                        color: "white",
                        cursor: "pointer",
                    }}
                    >
                        {key}
                        {sortConfig && sortConfig.key === key ? (
                        sortConfig.direction === "asc" ? (<FaSortUp />) : (<FaSortDown />)
                    ) : (
                        <FaSort />
                    )}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody>
                {sortedData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {Object.values(row).map((value, colIndex) => {
                            let formattedValue = value;
                            if (typeof value === "number" && colIndex !== 5) {
                                formattedValue = value.toLocaleString("en-US", { style: "currency", currency: "USD" });
                            }
                            else if (typeof value === "number" && colIndex == 5 && value > 0) {
                                formattedValue = "+" + value;
                            }
                            else if (typeof value === "string" && !isNaN(Date.parse(value))) {
                                const date = new Date(value);
                                formattedValue = date.toLocaleString();  // Default DateTime formatting (localized)
                            }
                            return (
                                <td key={colIndex} style={{ padding: "8px", textAlign: "center" }}>{formattedValue}</td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
            </table>
        ) : (
            <p>Loading CSV data...</p>
        )}
        </div>
    );
}
