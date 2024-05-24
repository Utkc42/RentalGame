import { faCartShopping, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useState } from "react";
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

  const handleAddToCart = (game) => {
    if (!user) {
      window.location.href = "/login";
      return;
    } else {
      addToCart(game);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000); // Message disappears after 3 seconds
    }
  };

  return (
    <div className="bg-slate-600 m-6 max-w-5xl mx-auto text-white p-10 rounded-lg shadow-lg">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img
            src={game.CoverImage || noImage}
            alt={game.Name}
            className="h-auto w-full object-cover md:w-80 rounded-md" // breedte
          />
        </div>
        <div className="mt-8 md:mt-0 md:ml-10 flex flex-col justify-between text-left">
          {" "}
          <div>
            <h1 className="text-5xl font-retro text-retroAccent mb-6">
              {game.Name}
            </h1>
            <div className="space-y-4 font-retro text-white">
              {" "}
              <div>
                <span className="font-bold text-black mr-2">Release Date:</span>
                <span>{game.ReleaseYear}</span>
              </div>
              <div>
                <span className="font-bold text-black mr-2">Category:</span>
                <span>{game.Category}</span>
              </div>
              <div>
                <span className="font-bold text-black mr-2">Platform:</span>
                <span>{game.ConsoleType}</span>
              </div>
              <div>
                <span className="font-bold text-black">Summary:</span>
                <p className="mt-1">{game.Description}</p>
              </div>
              <div>
                <span className="font-bold text-black mr-2">Rental Price:</span>
                <span>€{game.RentalPricePerWeek}</span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            {!game.IsAvailable && (
              <p className="text-retroRed font-retro">
                Sorry, this game is currently unavailable
              </p>
            )}
          </div>
          <div className="flex justify-between items-center mt-6">
            {user && decodedToken.role.toLowerCase() === "admin" && (
              <button
                onClick={() => handleDeleteGameClick(user, game)}
                className="bg-retroRed hover:bg-retroLightRed text-white font-bold px-8 py-4 rounded mr-4 flex items-center"
              >
                <FontAwesomeIcon icon={faTrash} className="text-white pr-2" />
                Delete
              </button>
            )}
            <button
              className={`bg-neonGreen hover:bg-lime-500 text-white font-bold py-4 px-8 rounded flex items-center ${
                game.IsAvailable ? "" : "cursor-not-allowed opacity-40"
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
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-neonGreen text-white py-2 px-4 rounded-lg text-sm mt-4 z-50">
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
    ConsoleType: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    RentalPricePerWeek: PropTypes.number.isRequired,
    IsAvailable: PropTypes.bool.isRequired,
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default GameDetailCard;
