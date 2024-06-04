import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import noImage from "../../assets/no_image_available.svg";

const GameCard = ({ game }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/games/${game.GameId}`);
  };

  return (
    <div
      className="relative p-1 bg-gray-900 rounded-lg shadow-xl border border-gray-800 cursor-pointer transform transition duration-300 hover:scale-105 flex flex-col w-full max-w-xs"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden flex-grow rounded-t-lg">
        <img
          src={game.CoverImage || noImage}
          alt={game.Name || "No Image Available"}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>
      <div className="p-4 text-white flex flex-col justify-between min-h-[8rem]">
        <h2 className="text-md font-retro font-bold mb-2">{game.Name}</h2>
        <div className="flex justify-between items-center">
          <p className="text-xl font-metro font-bold">{game.ConsoleType}</p>
          <p className="text-xl font-metro font-bold">
            € {game.RentalPricePerWeek.toFixed(2)}/week
          </p>
        </div>
      </div>
    </div>
  );
};

GameCard.propTypes = {
  game: PropTypes.shape({
    GameId: PropTypes.number.isRequired,
    Name: PropTypes.string.isRequired,
    CoverImage: PropTypes.string,
    ConsoleType: PropTypes.string.isRequired,
    RentalPricePerWeek: PropTypes.number.isRequired,
  }).isRequired,
};

export default GameCard;
