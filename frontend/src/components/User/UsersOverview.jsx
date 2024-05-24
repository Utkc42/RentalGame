import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import fetchUsers from "../../api/GetUsers";
import DeleteDialog from "../DeleteDialog";
import AdminDashboardFilter from "../AdminDashboardFilter";
import UserDetails from "./UserDetails";

const UsersOverview = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDeletedUsers, setShowDeletedUsers] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState("FirstName");
  const [sortOrder, setSortOrder] = useState("asc");
  const { user } = useUser();
  const [userId, setUserId] = useState();

  const toggleShowDeletedUsers = () => {
    setShowDeletedUsers(!showDeletedUsers);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const usersData = await fetchUsers(showDeletedUsers, user.token);
        setUsers(usersData);
        setFilteredUsers(usersData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    loadData();
  }, [showDeletedUsers, user.token]);

  const handleDeleteClick = (e, userId) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDeleteDialog(true);
    setUserToDelete(userId);
  };

  const handleClickUser = (e) => {
    const userId = e.currentTarget.querySelector('[name="userId"]').innerText;
    setUserId(userId);
    setShowUserDetails(true);
  };

  const deleteUser = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${userToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("User deleted successfully:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSearch = (query) => {
    const filtered = users.filter((user) =>
      `${user.FirstName} ${user.LastName} ${user.Email}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(order);
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[column] < b[column]) {
        return order === "asc" ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
    setFilteredUsers(sortedUsers);
  };

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin border-t-4 border-gray-400 rounded-full h-12 w-12">
            Loading...
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg text-white p-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-black">Users</h2>
            <div className="flex items-center">
              <input
                onClick={toggleShowDeletedUsers}
                type="checkbox"
                id="deletedUsers"
                name="deletedUsers"
                className="mr-2 size-5"
              />
              <label htmlFor="deletedUsers" className="text-black">
                Show deleted users
              </label>
            </div>
          </div>
          <AdminDashboardFilter onSearch={handleSearch} />
          <div className="overflow-x-auto">
            {filteredUsers.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-white text-black">
                  <tr>
                    <th
                      scope="col"
                      className="pl-2 cursor-pointer"
                      onClick={() => handleSort("FirstName")}
                    >
                      First Name
                    </th>
                    <th
                      scope="col"
                      className="pl-2 cursor-pointer"
                      onClick={() => handleSort("LastName")}
                    >
                      Last Name
                    </th>
                    <th scope="col" className="pl-2">
                      ID
                    </th>
                    <th
                      scope="col"
                      className="pl-2 cursor-pointer"
                      onClick={() => handleSort("Email")}
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="pl-2 cursor-pointer"
                      onClick={() => handleSort("PhoneNumber")}
                    >
                      PhoneNumber
                    </th>
                    <th
                      scope="col"
                      className="pl-2 cursor-pointer"
                      onClick={() => handleSort("AccountBalance")}
                    >
                      Account Balance
                    </th>
                    <th
                      scope="col"
                      className="pl-2 cursor-pointer"
                      onClick={() => handleSort("LateReturnCount")}
                    >
                      Late Return Count
                    </th>
                    <th scope="col" className="pl-2">
                      Active
                    </th>
                    <th scope="col" className="p-2">
                      <span className="sr-only">Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      onClick={handleClickUser}
                      key={user.id}
                      className="border-b h-10 bg-white text-black border-gray-700 hover:bg-gray-600"
                    >
                      <td name="firstName" className="pl-2">
                        {user.FirstName}
                      </td>
                      <td name="lastName" className="pl-2">
                        {user.LastName}
                      </td>
                      <td name="userId" className="pl-2">
                        {user.UserId}
                      </td>
                      <td name="email" className="pl-2">
                        {user.Email}
                      </td>
                      <td name="phoneNumber" className="pl-2">
                        {user.PhoneNumber}
                      </td>
                      <td name="accountBalance" className="pl-2">
                        {user.AccountBalance}
                      </td>
                      <td name="lateReturnCount" className="pl-2">
                        {user.LateReturnCount}
                      </td>
                      <td name="isDeleted" className="pl-2">
                        {user.IsDeleted ? "No" : "Yes"}
                      </td>
                      <td name="deleteBtn" className="p-2">
                        {!user.IsDeleted && (
                          <button
                            className="font-semibold text-sm bg-red-500 px-3 py-1 my-1 rounded-md hover:bg-red-600 focus:outline-none"
                            onClick={(e) => handleDeleteClick(e, user.UserId)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {showDeleteDialog && (
            <DeleteDialog
              setShowDeleteDialog={setShowDeleteDialog}
              handleDelete={deleteUser}
            />
          )}
          {showUserDetails && (
            <UserDetails
              setShowUserDetails={setShowUserDetails}
              userId={userId}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UsersOverview;
