import axios from "axios";

export const handleDeleteGameClick = async (user, game) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this game?"
  );

  if (confirmDelete) {
    try {
      const deleteUrl =
        import.meta.env.VITE_BACKEND_URL + `/api/games/${game.GameId}`;
      // Include the token in the request headers
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(deleteUrl, config);
      // refresh the page if request coming from the admin page
      if (window.location.pathname.includes("/admin")) {
        window.location.reload();
      } else {
        // redirect to home page
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
    }
  }
};
