import { FaGamepad } from "react-icons/fa";
import { Line } from "react-chartjs-2";

const GamesChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Games Added",
        data: [5, 10, 8, 15, 9, 12],
        borderColor: "#4CAF50", // Green color
        backgroundColor: "rgba(76, 175, 80, 0.3)", // Light green with more opacity
        borderWidth: 2,
        fill: true,
        tension: 0.4, // Smooth curves
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
          font: {
            family: "Arial",
            size: 14,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
          font: {
            family: "Arial",
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: {
            family: "Arial",
            size: 16,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#333",
        titleFont: { family: "Arial", size: 14, weight: "bold" },
        bodyFont: { family: "Arial", size: 12 },
        bodyColor: "#fff",
        borderColor: "#fff",
        borderWidth: 1,
      },
      title: {
        display: true,
        text: "Games Added Over Time",
        color: "#fff",
        font: {
          family: "Arial",
          size: 20,
        },
      },
    },
    animation: {
      duration: 1500,
      easing: "easeInOutBounce",
    },
  };

  return (
    <div className="max-w-md w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-600 rounded-full shadow-lg">
            <FaGamepad className="text-3xl text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Total Games</h2>
            <p className="text-2xl font-mono text-white">50</p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default GamesChart;
