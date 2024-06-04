import { useState, useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";
import Chart from "chart.js/auto"; // Import Chart.js library

const UserChart = () => {
  const [totalUsers, setTotalUsers] = useState(2400);
  const [userGrowth, setUserGrowth] = useState(12);
  const chartRef = useRef(null);

  const fetchUserData = () => {
    // Simulate data fetching
    setTimeout(() => {
      setTotalUsers(2400);
      setUserGrowth(12);
    }, 1000);
  };

  useEffect(() => {
    if (chartRef.current && totalUsers) {
      const ctx = chartRef.current.getContext("2d");
      let myChart = chartRef.current.myChart;
      if (myChart) {
        myChart.destroy();
      }
      chartRef.current.myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Total Users", "User Growth"],
          datasets: [
            {
              label: "User Data",
              data: [totalUsers, userGrowth],
              backgroundColor: ["#4CAF50", "#FFC107"], // Green and yellow colors
              borderColor: ["#fff", "#fff"],
              borderWidth: 2,
              borderRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
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
          },
          animation: {
            duration: 1500,
            easing: "easeInOutBounce",
          },
          scales: {
            x: {
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
              ticks: {
                color: "#333",
                font: {
                  family: "Arial",
                  size: 14,
                },
              },
            },
            y: {
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
              ticks: {
                color: "#333",
                font: {
                  family: "Arial",
                  size: 14,
                },
                beginAtZero: true,
              },
            },
          },
        },
      });
    }
  }, [totalUsers, userGrowth]);

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center">
        <div>
          <h5 className="leading-none text-4xl font-bold text-gray-900 pb-2">
            {totalUsers.toLocaleString()}
          </h5>
          <p className="text-base font-normal text-gray-500">Users this week</p>
        </div>
        <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500">
          {userGrowth}%
          <FaUser className="ml-1 text-lg text-gray-600" />
        </div>
      </div>
      <div className="flex justify-center py-6">
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="grid grid-cols-1 items-center border-t border-gray-200 justify-between">
        <div className="flex justify-between items-center pt-5">
          <button className="text-sm font-medium text-gray-500 hover:text-gray-900 text-center inline-flex items-center">
            Last 7 days
          </button>
          <a
            href="#"
            className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 px-3 py-2"
          >
            Users Report
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserChart;
