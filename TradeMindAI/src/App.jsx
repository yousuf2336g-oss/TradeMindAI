import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const App = () => {
  const [data, setData] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [pair, setPair] = useState("BTCUSDT");

  const fetchData = async () => {
    try {
      const res = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1h&limit=30`);
      const prices = res.data.map(d => ({ time: new Date(d[0]).toLocaleTimeString(), price: parseFloat(d[4]) }));
      setData(prices);
    } catch (err) {
      console.error(err);
    }
  };

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/analyze", { pair });
      setAnalysis(res.data.analysis);
    } catch (err) {
      setAnalysis("⚠️ Test Mode Active — Add your API key in Vercel to enable live AI analysis.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [pair]);

  const chartData = {
    labels: data.map(p => p.time),
    datasets: [
      {
        label: `${pair} Price`,
        data: data.map(p => p.price),
        borderColor: "#00b7ff",
        backgroundColor: "rgba(0, 183, 255, 0.2)",
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-2 text-neon">TradeMind AI</h1>
      <p className="text-gray-400 mb-6">Smart Crypto Insights 💡</p>

      <div className="w-full max-w-3xl bg-gray-900 p-4 rounded-xl shadow-lg">
        <div className="flex justify-between mb-4">
          <select
            className="bg-gray-800 text-white p-2 rounded-md"
            value={pair}
            onChange={(e) => setPair(e.target.value)}
          >
            <option>BTCUSDT</option>
            <option>ETHUSDT</option>
            <option>BNBUSDT</option>
            <option>SOLUSDT</option>
          </select>
          <button
            onClick={analyze}
            className="bg-neon text-black font-semibold px-4 py-2 rounded-md hover:opacity-80 transition"
          >
            {loading ? "Analyzing..." : "Analyze 🔍"}
          </button>
        </div>

        <Line data={chartData} />
        <div className="mt-4 bg-gray-800 p-3 rounded-md">
          <h2 className="text-xl font-bold mb-2 text-neon">AI Analysis:</h2>
          <p className="text-gray-200 whitespace-pre-wrap">
            {analysis || "Press 'Analyze' to get insights 📈"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
