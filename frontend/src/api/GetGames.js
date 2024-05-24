import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/games`;

const fetchGames = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching game data:", error);
    throw error;
  }
};

export default fetchGames;
