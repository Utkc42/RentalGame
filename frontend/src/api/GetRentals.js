import axios from "axios";

const fetchRentals = async (showReturnedGames, token) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/rentals${
        showReturnedGames ? "?includeDeleted=true" : ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Rentals:", response);
    // sort rentals by desc end date
    response.data.sort((a, b) => {
      // Compare IsDeleted first
      if (a.IsDeleted && !b.IsDeleted) {
        return 1; // a comes after b
      } else if (!a.IsDeleted && b.IsDeleted) {
        return -1; // a comes before b
      } else {
        // If IsDeleted flags are equal, compare EndRentalPeriod
        return new Date(b.EndRentalPeriod) - new Date(a.EndRentalPeriod);
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching rentals: ", error);
    throw error;
  }
};

export default fetchRentals;
