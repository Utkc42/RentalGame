import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const UserRentals = ({ user, showReturnedGames }) => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/rentals/myRentals`,
          {
            params: {
              includeDeleted: showReturnedGames,
            },
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setRentals(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching rentals:", error);
      }
    };
    loadData();
  }, [showReturnedGames, user.token]);

  if (loading) {
    return <div className="text-white">Loading rentals...</div>;
  }

  if (rentals.length === 0) {
    return <div className="text-white">No rentals found.</div>;
  }

  return (
    <div className="bg-slate-800 p-4 rounded-lg mt-4">
      <h2 className="text-2xl text-white font-bold mb-4">Your Rentals</h2>
      <ul>
        {rentals.map((rental) => (
          <li
            key={rental.RentalId}
            className="my-2 p-2 bg-gray-700 rounded-lg flex items-center">
            <FontAwesomeIcon icon={faGamepad} className="text-white pr-2" />
            <span className="text-white">{rental.GameName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

UserRentals.propTypes = {
  user: PropTypes.shape({
    UserId: PropTypes.number.isRequired,
    token: PropTypes.string.isRequired,
  }).isRequired,
  showReturnedGames: PropTypes.bool.isRequired,
};

export default UserRentals;
