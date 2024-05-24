import axios from "axios";

const fetchUsers = async (showDeletedUsers, token) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/users${
        showDeletedUsers ? "?includeDeleted=true" : ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Users:", response);
    // sort users by name
    response.data.sort((a, b) => {
      return a.FirstName.localeCompare(b.FirstName);
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users: ", error);
    throw error;
  }
};

export default fetchUsers;
