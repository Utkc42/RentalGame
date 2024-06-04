import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import GameDetailCard from "../components/Game/GameDetailCard";
import axios from "axios"; // Import Axios
import { useCart } from "../context/CartContext";

const GameDetailPage = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const getGameDetail = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/games/${id}`
        ); // Make Axios GET request
        setGame(response.data); // Set game data
      } catch (error) {
        console.error("Error fetching game detail:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    getGameDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin border-t-4 border-white rounded-full h-12 w-12"></div>
      </div>
    );
  }

  if (isError || !game) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          Error loading game or no game available.
        </h2>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-retroBackground pt-20">
      <GameDetailCard game={game} addToCart={addToCart} />
    </div>
  );
};

export default GameDetailPage;
