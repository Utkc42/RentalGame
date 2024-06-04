import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { getFormattedDate } from "../../utils/helpers";
import ReturnGameDialog from "./ReturnGameDialog";
import fetchRentals from "../../api/GetRentals";
import AdminDashboardFilter from "../AdminDashboardFilter";

const ReturnGameComponent = () => {
  const [rentals, setRentals] = useState([]);
  const [gameToReturn, setGameToReturn] = useState({});
  const [showReturnedGames, setShowReturnedGames] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const { user } = useUser();
  const returnDate = getFormattedDate(new Date());
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleReturnClick = (rentalId) => {
    setGameToReturn(
      filteredRentals.find((rental) => rental.RentalId === rentalId)
    );
    setShowDialog(true);
  };

  const returnGame = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/rentals/checkin/${
          gameToReturn.RentalId
        }`,
        null,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      // Update filteredRentals state to remove the returned game
      setFilteredRentals(
        filteredRentals.filter(
          (rental) => rental.RentalId !== gameToReturn.RentalId
        )
      );

      setShowDialog(false);
    } catch (error) {
      console.error("Error returning game:", error);
    }
  };

  const toggleShowReturnedGames = () => {
    setShowReturnedGames(!showReturnedGames);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const rentalsData = await fetchRentals(showReturnedGames, user.token);
        setRentals(rentalsData);
        setFilteredRentals(rentalsData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    loadData();
  }, [showReturnedGames, user.token]);

  const handleSearch = (query) => {
    const filtered = rentals.filter(
      (rental) =>
        `${rental.UserName}`.toLowerCase().includes(query.toLowerCase()) ||
        `${rental.GameName}`.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRentals(filtered);
  };

  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(order);
    const sortedRentals = [...filteredRentals].sort((a, b) => {
      if (a[column] < b[column]) {
        return order === "asc" ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
    setFilteredRentals(sortedRentals);
  };

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin border-t-4 border-gray-400 rounded-full h-12 w-12">
            Loading...
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg text-white p-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-black">Rentals</h2>
            <div className="flex items-center">
              <input
                onClick={toggleShowReturnedGames}
                type="checkbox"
                id="late"
                name="late"
                className="mr-2 size-5"
              />
              <label htmlFor="late" className="text-black">
                Show returned games
              </label>
            </div>
          </div>
          <AdminDashboardFilter onSearch={handleSearch} />
          {filteredRentals.length === 0 ? (
            <p>No rentals found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase text-black">
                  <tr>
                    <th
                      scope="col"
                      className="pl-2 cursor-pointer"
                      onClick={() => handleSort("UserName")}
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="pl-2 cursor-pointer"
                      onClick={() => handleSort("GameName")}
                    >
                      Game
                    </th>
                    <th
                      scope="col"
                      className="pl-2 cursor-pointer"
                      onClick={() => handleSort("StartRentalPeriod")}
                    >
                      Start Date
                    </th>
                    <th
                      scope="col"
                      className="pl-2 cursor-pointer"
                      onClick={() => handleSort("EndRentalPeriod")}
                    >
                      End Date
                    </th>
                    <th
                      scope="col"
                      className="pl-2 cursor-pointer"
                      onClick={() => handleSort("IsDeleted")}
                    >
                      Status
                    </th>
                    <th scope="col" className="p-2">
                      <span className="sr-only">Return</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRentals.map((rental) => (
                    <tr
                      key={rental.id}
                      className="border-b h-10 text-black border-gray-700 hover:bg-gray-600 hover:text-white"
                    >
                      <td className="pl-2">{rental.UserName}</td>
                      <td className="pl-2">{rental.GameName}</td>
                      <td className="pl-2">
                        {getFormattedDate(rental.StartRentalPeriod)}
                      </td>
                      <td className="pl-2">
                        {getFormattedDate(rental.EndRentalPeriod)}
                      </td>
                      <td className="pl-2">
                        {rental.IsDeleted ? (
                          <span>Returned</span>
                        ) : (
                          <span
                            className={`${
                              returnDate > rental.EndRentalPeriod
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {returnDate > rental.EndRentalPeriod
                              ? "Late"
                              : "On time"}
                          </span>
                        )}
                      </td>
                      <td className="p-2">
                        {!rental.IsDeleted && (
                          <button
                            className="font-semibold text-sm bg-red-500 px-3 py-1 my-1 rounded-md hover:bg-red-600 focus:outline-none"
                            onClick={() => handleReturnClick(rental.RentalId)}
                          >
                            Return
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {showDialog && (
        <ReturnGameDialog
          gameToReturn={gameToReturn}
          returnGame={returnGame}
          setShowDialog={setShowDialog}
        />
      )}
    </div>
  );
};

export default ReturnGameComponent;
