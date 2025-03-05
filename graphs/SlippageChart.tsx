import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

interface SlippagePerDollar {
    slippage: number;
    tradeValue: number;
    slippagePerDollar: number;
}

interface Data {
    pair: string;
    slippage: SlippagePerDollar[]
}

interface ChartProps {
  data: Data | null;
}

const SlippageChart: React.FC<ChartProps> = ({ data }) => {
    if (!data) return <p>No Data Available</p>;
    
    const groupedData: Record<number, { tradeValue: number; [pair: string]: number }> = {};

    Object.entries(data).forEach(([pair, slippageArray]) => {
        slippageArray.forEach(({ tradeValue, slippagePerDollar }: SlippagePerDollar) => {
            if (!groupedData[tradeValue]) {
                groupedData[tradeValue] = { tradeValue };
            }
            groupedData[tradeValue][pair] = slippagePerDollar; // Store value under the pair name
        });
    });

    const transformedData = Object.values(groupedData);
    return (
        <ResponsiveContainer width={900} height={400}>
            <LineChart data={transformedData}>
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis dataKey="tradeValue" tick={{ fontSize: 10 }} tickFormatter={(value) => `$${value.toLocaleString()}`} />
                <YAxis domain={[-0.000027, 0.000027]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />

                {Object.keys(data).map((pair, index) => (
                    <Line
                        key={pair}
                        connectNulls={true}
                        type="monotone"
                        dataKey={pair}
                        stroke={["#8884d8", "#82ca9d", "#FF5733", "#FFAA33"][index % 4]} // Rotate colors
                        dot={{ r: 1 }}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default SlippageChart;

