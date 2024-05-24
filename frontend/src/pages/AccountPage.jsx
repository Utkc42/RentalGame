import { useUser } from "../context/UserContext";
import { getFormattedDate } from "../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faCalendarAlt,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import ChangeUserInfo from "../components/User/ChangeUserInfo";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const AccountPage = () => {
  const { user } = useUser();
  const [fullUser, setFullUser] = useState(user);
  const [userRentals, setUserRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const labelStyle = "text-black text-sm font-semibold";
  const valueStyle = "text-black pl-2 text-bold text-base";
  const detailStyle = "my-3 flex items-center text-black";
  const iconStyle = "text-black pr-2";

  const handleExtendRental = async (rentalId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/rentals/${rentalId}/extend`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Response:", response);
      if (response.data.success) {
        alert("Huurperiode succesvol verlengd!");
      } else {
        alert("Kan huurperiode niet verlengen.");
      }
    } catch (error) {
      console.error("Error extending rental:", error);
      alert("Er is een fout opgetreden bij het verlengen van de huurperiode.");
    }
  };

  // fetch AccountBalance of user using api/users/{id}
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${user.UserId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setFullUser(response.data);
        console.log("User:", response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [user]);

  useEffect(() => {
    const fetchUserRentals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/rentals?userId=${
            user.UserId
          }`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setUserRentals(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user rentals:", error);
        setLoading(false);
      }
    };
    fetchUserRentals();
  }, [user]);

  const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber) {
      const digitsOnly = phoneNumber.replace(/\D/g, "");
      return `+${digitsOnly.slice(0, 2)} ${digitsOnly.slice(
        2,
        5
      )} ${digitsOnly.slice(5, 7)} ${digitsOnly.slice(7, 9)} ${digitsOnly.slice(
        9
      )}`;
    }
    return "No number available";
  };

  const handlePayFee = async () => {
    // Implement handlePayFee logic here
  };

  return (
    <div className="p-8">
      <div className="mx-auto bg-white rounded-lg border-2 shadow-md max-w-screen-sm">
        <div className="p-4 bg-darkblue rounded-t-lg text-white text-center">
          <h2 className="text-2xl font-bold">Profile</h2>
        </div>
        <div className="p-4 pt-2 text-left">
          <div className={detailStyle}>
            <FontAwesomeIcon icon={faUser} className={iconStyle} />
            <span className={labelStyle}>Name:</span>
            <span className={valueStyle}>
              {user.FirstName} {user.LastName}
            </span>
          </div>
          <div className={detailStyle}>
            <FontAwesomeIcon icon={faEnvelope} className={iconStyle} />
            <span className={labelStyle}>Email:</span>
            <span className={valueStyle}> {user.Email}</span>
          </div>
          <div className={detailStyle}>
            <FontAwesomeIcon icon={faPhone} className={iconStyle} />
            <span className={labelStyle}>Phone:</span>
            <span className={valueStyle}>
              {formatPhoneNumber(user.PhoneNumber)}
            </span>
          </div>
          <div className={detailStyle}>
            <FontAwesomeIcon icon={faCalendarAlt} className={iconStyle} />
            <span className={labelStyle}>Date joined:</span>
            <span className={valueStyle}>
              {getFormattedDate(user.CreatedAt)}
            </span>
          </div>
          {fullUser.AccountBalance > 0 && (
            <div className={detailStyle}>
              <FontAwesomeIcon icon={faBell} className={iconStyle} />
              <span className={labelStyle}>Late fee:</span>
              <span className={valueStyle}>
                € {fullUser.AccountBalance.toFixed(2)}
              </span>
              <button
                className="block bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded ml-2"
                onClick={handlePayFee}
              >
                Pay fee
              </button>
            </div>
          )}
          <ChangeUserInfo user={user} />
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="mt-8 overflow-x-auto shadow-md rounded-lg text-white p-4">
          <div className="flex items-center justify-between mb-4 px-5">
            <h2 className="text-xl font-semibold mt-3">Your Rentals</h2>
          </div>
          {userRentals.length === 0 ? (
            <p>No rentals found.</p>
          ) : (
            <table className="w-full">
              <thead className="text-xs uppercase bg-gray-700">
                <tr>
                  <th className="px-6 py-3">Game</th>
                  <th className="px-6 py-3">Start Date</th>
                  <th className="px-6 py-3">End Date</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {userRentals.map((rental) => (
                  <tr
                    key={rental.id}
                    className="border-b h-10 bg-gray-800 border-gray-700 hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">{rental.GameName}</td>
                    <td className="px-6 py-4">
                      {getFormattedDate(rental.StartRentalPeriod)}
                    </td>
                    <td className="px-6 py-4">
                      {getFormattedDate(rental.EndRentalPeriod)}
                    </td>
                    <td>
                      {!rental.IsDeleted && (
                        <button
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded ml-2"
                          onClick={() => handleExtendRental(rental.id)}
                        >
                          <FontAwesomeIcon icon={faPlus} className="mr-1" />
                          Extend Rental
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountPage;
