import { useState, useEffect } from "react";
import axios from "axios";

const UsersGrid = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users`
        );
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Users Grid</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id} className="border p-4 rounded-md bg-gray-100">
              <p className="font-semibold">{user.name}</p>
              <p>Email: {user.email}</p>
              <p>Address: {user.address}</p>
              {/* Add more user data fields as needed */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersGrid;
