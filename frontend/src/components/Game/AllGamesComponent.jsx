import { useState, useEffect } from "react";
import axios from "axios";
import { handleDeleteGameClick } from "../../api/DeleteGame";
import { useUser } from "../../context/UserContext";
import UserFilter from "../AdminDashboardFilter";

const AllGamesComponent = () => {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDescription, setExpandedDescription] = useState({});
  const { user } = useUser();
  const [filteredGames, setFilteredGames] = useState([]);
  const [sortColumn, setSortColumn] = useState("Name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getAllUrl = import.meta.env.VITE_BACKEND_URL + `/api/games`;
        const response = await axios.get(getAllUrl);
        setGames(response.data);
        setFilteredGames(response.data);
      } catch (error) {
        console.error("Error fetching game data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to toggle expanded description
  const toggleDescription = (id) => {
    setExpandedDescription((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleSearch = (query) => {
    const filtered = games.filter((game) =>
      `${game.Name} ${game.Category} ${game.ConsoleType}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    setFilteredGames(filtered);
  };

  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(order);
    const sortedGames = [...filteredGames].sort((a, b) => {
      if (a[column] < b[column]) {
        return order === "asc" ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
    setFilteredGames(sortedGames);
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <UserFilter onSearch={handleSearch} />
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin border-t-4 border-gray-400 rounded-full h-12 w-12">
            Loading...
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-200">
                <th
                  className="pl-2 text-left cursor-pointer"
                  onClick={() => handleSort("Name")}
                >
                  Title
                </th>
                <th
                  className="pl-2 text-left cursor-pointer"
                  onClick={() => handleSort("RentalPricePerWeek")}
                >
                  Price
                </th>
                <th
                  className="pl-2 text-left cursor-pointer"
                  onClick={() => handleSort("ReleaseYear")}
                >
                  Release Year
                </th>
                <th
                  className="pl-2 text-left cursor-pointer"
                  onClick={() => handleSort("Category")}
                >
                  Category
                </th>
                <th
                  className="pl-2 text-left cursor-pointer"
                  onClick={() => handleSort("ConsoleType")}
                >
                  Platform
                </th>
                <th className="pl-2 text-left">Description</th>
                <th className="p-2 text-left">Availability</th>
                <th className="p-2 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.map((game) => (
                <tr key={game.id} className="border-b border-gray-200">
                  <td className="pl-2">{game.Name}</td>
                  <td className="pl-2">
                    €&nbsp;{game.RentalPricePerWeek.toFixed(2)}
                  </td>
                  <td className="pl-2">{game.ReleaseYear}</td>
                  <td className="pl-2">{game.Category}</td>
                  <td className="pl-2">{game.ConsoleType}</td>
                  <td className="pl-2">
                    {game.Description.length > 50 ? (
                      <>
                        {expandedDescription[game.id] ? (
                          <span>{game.Description}</span>
                        ) : (
                          <span>{game.Description.slice(0, 50)}...</span>
                        )}
                        <button
                          className="ml-2 text-blue-600 hover:underline focus:outline-none"
                          onClick={() => toggleDescription(game.id)}
                        >
                          {expandedDescription[game.id] ? "Less" : "More"}
                        </button>
                      </>
                    ) : (
                      <span>{game.Description}</span>
                    )}
                  </td>
                  <td
                    className={`pl-2 ${
                      game.IsAvailable ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {game.IsAvailable ? "Available" : "Not Available"}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDeleteGameClick(user, game)}
                      className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllGamesComponent;
