import { useState } from "react";
import AddGameForm from "../components/Game/AddGameForm";
import ReturnGameComponent from "../components/Game/ReturnGameComponent";
import UsersOverview from "../components/User/UsersOverview";
import AllGamesComponent from "../components/Game/AllGamesComponent"; // Import the AllGamesComponent
import UserChart from "../components/Charts/UserChart";
import GamesChart from "../components/Charts/GamesChart";

const AdminDashboardPage = () => {
  const [activeComponent, setActiveComponent] = useState("");
  const [showMainDashboard, setShowMainDashboard] = useState(true);

  const handleComponentChange = (component) => {
    setActiveComponent(component);
    setShowMainDashboard(false);
  };

  const handleGoHome = () => {
    setShowMainDashboard(true);
  };

  const buttonStyle =
    "block w-full py-2 px-2 border border-black font-semibold rounded bg-brightRed text-white hover:bg-electricBlue hover:text-darkblue";

  return (
    <div className="flex justify-center items-center pt-10">
      <div className="w-full mx-auto shadow-md rounded-lg overflow-hidden">
        <div className="flex bg-white text-darkblue items-center justify-between p-4">
          <h1 className="text-2xl font-bold font-retro">Admin Dashboard</h1>
          <button
            className="px-4 py-2 bg-headerBg border border-black text-black font-semibold rounded-md hover:bg-blue-100"
            onClick={handleGoHome}
          >
            Home
          </button>
        </div>
        <div className="flex">
          <div className="w-1/6 bg-white">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 font-retro">Menu</h2>
              <div className="space-y-4 pt-4">
                <button
                  className={buttonStyle}
                  onClick={() => handleComponentChange("addGame")}
                >
                  Add New Game
                </button>
                <button
                  className={buttonStyle}
                  onClick={() => handleComponentChange("returnGame")}
                >
                  View Active Rentals
                </button>
                <button
                  className={buttonStyle}
                  onClick={() => handleComponentChange("getAllUsers")}
                >
                  View All Users
                </button>
                <button
                  className={buttonStyle}
                  onClick={() => handleComponentChange("allGames")}
                >
                  View All Games
                </button>
              </div>
            </div>
          </div>
          <div className="w-5/6 bg-gray-100 px-3 py-1">
            {showMainDashboard ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4 font-retro">
                  Welcome to the Admin Dashboard!
                </h2>
                <p className="text-neonGreen text-sm font-retro">
                  You can manage games and users from here.
                </p>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <UserChart />
                  <GamesChart />
                </div>
              </div>
            ) : (
              <div>
                {activeComponent === "addGame" && <AddGameForm />}
                {activeComponent === "returnGame" && <ReturnGameComponent />}
                {activeComponent === "getAllUsers" && <UsersOverview />}
                {activeComponent === "allGames" && <AllGamesComponent />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
