import React, { useEffect, useState } from "react";
import { useGetTradeData } from "../../hooks/useGetTradeData";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import SlippageChart from "./SlippageChart";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CSVRow {
    [key: string]: string | number; // Represents a row with dynamic column headers
}

interface SlippagePerDollar {
    slippage: number;
    tradeValue: number;
    slippagePerDollar: number;
}

interface SlippagePerDollarPerPair {
    pair: string;
    slippage: SlippagePerDollar[]
}

export default function SlippagePerDollar() {
    const { data } = useGetTradeData("/data/trade_log.csv");
    // highest slippage with lowest usd spent, slippage per dollar spent
    const [slippagePerDollarPerPair, setSlippagePerDollarPerPair] = useState<SlippagePerDollarPerPair | null>(null);

    useEffect(() => {
        if (!data) return;

        // need to calculate slippage then store it in array of objects
        // slippage, trade value, slippage per dollar, pair
        const slippagePerDollar = data.map((row: CSVRow) => {
            const tradeValue: number = Number(row["Trade Value"]);
            const slippage: number = Number(row["Slippage %"]);    
            const slippagePerDollar = parseFloat((slippage / tradeValue).toFixed(10));
            return {
                slippage,
                tradeValue,
                slippagePerDollar,
                pair: String(row["Pair"]),
            };
        });

        // console.log(slippagePerDollar);

        const slippagePerDollarPerPair = slippagePerDollar.reduce((acc: any, { pair, slippagePerDollar, slippage, tradeValue }) => {
            if (!acc[pair]) {
                acc[pair] = [{ slippagePerDollar: slippagePerDollar, slippage: slippage, tradeValue: tradeValue }];
            }
            acc[pair].push({ slippagePerDollar, slippage, tradeValue });
            return acc;
        }, {});
        setSlippagePerDollarPerPair(slippagePerDollarPerPair);

    }, [data]);

    return (
        <>
        <div style={{ padding: "16px" }}>
            <h2>Slippage % per Dollar per Pair</h2>

            <SlippageChart data={slippagePerDollarPerPair} />
        </div>
        </>
    );
}
