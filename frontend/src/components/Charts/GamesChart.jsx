//import React from 'react';
import { FaGamepad } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';

const GamesChart = () => {
  // Mock data for the line chart
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Games Added',
        data: [5, 10, 8, 15, 9, 12],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#fff',
        },
      },
      title: {
        display: true,
        text: 'Games Added Over Time',
        color: '#fff',
      },
    },
  };

  return (
    <div className="max-w-sm w-full bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-500 rounded-full shadow-lg">
            <FaGamepad className="text-2xl text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Total Games</h2>
            <p className="text-xl font-mono text-white">50</p>
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
