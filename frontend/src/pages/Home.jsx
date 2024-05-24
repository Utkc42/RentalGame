import { useEffect, useState } from "react";
import axios from "axios";
import GameCard from "../components/Game/GameCard";
import HeroSection from "../components/HeroSection";
import Filter from "../components/Filter";

const Home = () => {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [filteredGames, setFilteredGames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getAllUrl = import.meta.env.VITE_BACKEND_URL + `/api/games`;
        const response = await axios.get(getAllUrl);
        setGames(response.data);
        setFilteredGames(response.data);
      } catch (error) {
        console.error("Error fetching game data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin border-t-4 border-gray-400 rounded-full h-12 w-12"></div>
      </div>
    );
  }

  if (isError || games.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          {isError ? "Error loading games." : "No games available."}
        </h2>
      </div>
    );
  }

  return (
    <div className="p-2 relative">
      <HeroSection />
      <Filter games={games} setFilteredGames={setFilteredGames} />
      <div className="pt-4 grid gap-4 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <GameCard key={game.gameId} game={game} />
          ))
        ) : (
          <div className="col-span-full text-center text-white">
            No games found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
