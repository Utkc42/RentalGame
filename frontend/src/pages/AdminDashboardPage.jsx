import { useState } from "react";
import AddGameForm from "../components/Game/AddGameForm";
import ReturnGameComponent from "../components/Game/ReturnGameComponent";
import UsersOverview from "../components/User/UsersOverview";
import AllGamesComponent from "../components/Game/AllGamesComponent";

const AdminDashboardPage = () => {
  const [activeComponent, setActiveComponent] = useState("returnGame");

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  const buttonStyle =
    "block w-full py-2 px-4 mb-2 text-left font-semibold rounded-lg transition duration-300 transform hover:bg-electricBlue hover:text-darkblue hover:scale-105 focus:outline-none focus:ring-2 focus:ring-electricBlue focus:ring-opacity-50";

  return (
    <div className="flex h-screen">
      <div className="w-1/5 bg-white p-4 flex flex-col justify-between min-h-full">
        <div>
          <h2 className="text-xl font-semibold mb-4 font-retro">Menu</h2>
          <div className="space-y-2">
            <button
              className={buttonStyle}
              onClick={() => handleComponentChange("addGame")}>
              Add New Game
            </button>
            <button
              className={buttonStyle}
              onClick={() => handleComponentChange("returnGame")}>
              View Rentals
            </button>
            <button
              className={buttonStyle}
              onClick={() => handleComponentChange("getAllUsers")}>
              View Users
            </button>
            <button
              className={buttonStyle}
              onClick={() => handleComponentChange("allGames")}>
              View Games
            </button>
          </div>
        </div>
      </div>
      <div className="w-4/5 bg-gray-100 p-6 overflow-y-auto">
        <div>
          {activeComponent === "addGame" && <AddGameForm />}
          {activeComponent === "returnGame" && <ReturnGameComponent />}
          {activeComponent === "getAllUsers" && <UsersOverview />}
          {activeComponent === "allGames" && <AllGamesComponent />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
