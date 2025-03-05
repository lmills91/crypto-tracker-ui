import Papa from "papaparse";
import { useState, useEffect } from "react";

interface CSVRow {
  [key: string]: string; // Represents a row with dynamic column headers
}

export function useGetTradeData(filename: string) {
  const [data, setData] = useState<CSVRow[]>([]);

  useEffect(() => {
    fetch(filename) // If stored in /public folder
      .then((response) => response.text())
      .then((csv) => {
        const parsed = Papa.parse<CSVRow>(csv, { header: true, skipEmptyLines: true, dynamicTyping: true });
        setData(parsed.data);
      });
  }, []);

  return { data };
}
