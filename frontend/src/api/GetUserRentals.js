const fetchUserRentals = async (showReturnedGames, token) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/rentals/myRentals`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch rentals");
    }
    const data = await response.json();
    return data;
  };

  export default fetchUserRentals;