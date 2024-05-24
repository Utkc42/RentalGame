import { useState, useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";
import Chart from "chart.js/auto"; // Import Chart.js library

const UserChart = () => {
  // State variables to store dynamic data
  const [totalUsers, setTotalUsers] = useState("32.4k");
  const [userGrowth, setUserGrowth] = useState("12%");
  const chartRef = useRef(null); // Ref for the chart instance

  // Simulated fetch function to get user data
  const fetchUserData = () => {
    // Simulating API call delay
    setTimeout(() => {
      setTotalUsers("2.4k"); // Replace with dynamic data from API
      setUserGrowth("12%"); // Replace with dynamic data from API
    }, 1000); // Simulated delay of 1 second
  };

  // Create or update the chart when user data changes
  useEffect(() => {
    // Ensure chartRef has been initialized and totalUsers is not empty
    if (chartRef.current && totalUsers) {
      const ctx = chartRef.current.getContext("2d");
      let myChart = chartRef.current.myChart;
      // Destroy existing chart instance if it exists
      if (myChart) {
        myChart.destroy();
      }
      // Create new chart instance
      chartRef.current.myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Total Users", "User Growth"],
          datasets: [
            {
              label: "User Data",
              data: [totalUsers, userGrowth],
              backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
              borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }, [totalUsers, userGrowth]);

  // Fetch user data when the component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
            {totalUsers}
          </h5>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            Users this week
          </p>
        </div>
        <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
          {userGrowth}
          <svg
            className="w-3 h-3 ms-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13V1m0 0L1 5m4-4 4 4"
            />
          </svg>
        </div>
      </div>
      <div className="flex justify-center py-6">
        <FaUser className="text-6xl text-gray-900 dark:text-white" />
      </div>
      <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
        <div className="flex justify-between items-center pt-5">
          <button
            id="dropdownDefaultButton"
            data-dropdown-toggle="lastDaysdropdown"
            data-dropdown-placement="bottom"
            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
            type="button"
          >
            Last 7 days
            <svg className="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg>
          </button>
          <div id="lastDaysdropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Yesterday</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Today</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 7 days</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 30 days</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 90 days</a>
              </li>
            </ul>
          </div>
          <a
            href="#"
            className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2"
          >
            Users Report
            <svg className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserChart;
