import { faCartShopping, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import noImage from "../../assets/no_image_available.svg";
import { jwtDecode } from "jwt-decode";
import { handleDeleteGameClick } from "../../api/DeleteGame";

const GameDetailCard = ({ game, addToCart }) => {
  const [showMessage, setShowMessage] = useState(false);
  const { user } = useUser();
  let decodedToken;
  if (user) {
    decodedToken = jwtDecode(user.token);
  }

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when component mounts
  }, [game]);

  const handleAddToCart = (game) => {
    if (!user) {
      window.location.href = "/auth";
      return;
    } else {
      addToCart(game);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000); // Message disappears after 3 seconds
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 m-6 max-w-6xl mx-auto text-white p-6 rounded-lg shadow-lg">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img
            src={game.CoverImage || noImage}
            alt={game.Name}
            className="h-[500px] w-full object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="mt-6 md:mt-0 md:ml-8 flex flex-col justify-between text-left">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4">{game.Name}</h1>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-300 text-xl">
                  Release Date:
                </span>
                <span className="text-gray-100 ml-2 text-lg">
                  {game.ReleaseYear}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-300 text-xl">
                  Publisher:
                </span>
                <span className="text-gray-100 ml-2 text-lg">
                  {game.Publisher}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-300 text-xl">
                  Category:
                </span>
                <span className="text-gray-100 ml-2 text-lg">
                  {game.Category}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-300 text-xl">
                  Platform:
                </span>
                <span className="text-gray-100 ml-2 text-lg">
                  {game.ConsoleType}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-300 text-xl">
                  Summary:
                </span>
                <p className="text-gray-100 mt-1 text-lg">{game.Description}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-300 text-xl">
                  Rental Price (per Week):
                </span>
                <span className="text-gray-100 ml-2 text-lg">
                  €{game.RentalPricePerWeek}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            {!game.IsAvailable && (
              <p className="text-red-500 font-semibold">
                Sorry, this game is currently unavailable
              </p>
            )}
          </div>
          <div className="flex justify-between items-center mt-6">
            {user && decodedToken.role.toLowerCase() === "admin" && (
              <button
                onClick={() => handleDeleteGameClick(user, game)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg flex items-center transition duration-200 ease-in-out transform hover:scale-105"
              >
                <FontAwesomeIcon icon={faTrash} className="text-white pr-2" />
                Delete
              </button>
            )}
            <button
              className={`bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center transition duration-200 ease-in-out transform hover:scale-105 ${
                game.IsAvailable ? "" : "cursor-not-allowed opacity-50"
              }`}
              onClick={() => handleAddToCart(game)}
              disabled={!game.IsAvailable}
            >
              <FontAwesomeIcon
                icon={faCartShopping}
                className="text-white pr-2"
              />
              Rent game
            </button>
          </div>
        </div>
        {showMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg text-sm mt-4 z-50">
            The game has been added to your cart.
          </div>
        )}
      </div>
    </div>
  );
};

GameDetailCard.propTypes = {
  game: PropTypes.shape({
    GameId: PropTypes.number.isRequired,
    CoverImage: PropTypes.string.isRequired,
    Name: PropTypes.string.isRequired,
    Category: PropTypes.string.isRequired,
    ReleaseYear: PropTypes.number.isRequired,
    Publisher: PropTypes.string.isRequired,
    ConsoleType: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    RentalPricePerWeek: PropTypes.number.isRequired,
    IsAvailable: PropTypes.bool.isRequired,
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default GameDetailCard;
