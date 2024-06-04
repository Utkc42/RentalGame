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
import payLateFee from "../api/PayLateFee";
import initiateRentalPayment from "../api/PayRental";

const AccountPage = () => {
  const { user, updateUser } = useUser();
  const [fullUser, setFullUser] = useState(user);
  const [userRentals, setUserRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const tableIconStyle = "pl-2 py-4";
  const tableRowInfoStyle = "border-t border-black";
  const iconStyle = "text-black pr-2";

  const handleExtendRental = async (rental) => {
    const paymentData = gatherPaymentData(rental);
    await initiateRentalPayment(paymentData, user);
    extendRental(rental);
  };

  const gatherPaymentData = (rental) => {
    const paymentData = {
      amountInCents: (rental.RentalPrice - rental.RentalPrice * 0.1) * 100,
      currencyCode: "EUR",
      description: `RetroRental Extension - user id ${user.UserId}`,
      firstName: `${user.FirstName}`,
      lastName: `${user.LastName}`,
      country: "BE",
      locale: "EN",
      email: `${user.Email}`,
    };
    return paymentData;
  };

  const extendRental = async (rental) => {
    try {
      const extendUrl = `${import.meta.env.VITE_BACKEND_URL}/api/rentals/${
        rental.RentalId
      }/extend`;
      const response = await fetch(extendUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        const updatedRental = await response.json();
        setUserRentals((prevRentals) =>
          prevRentals.map((r) =>
            r.RentalId === updatedRental.RentalId
              ? { ...r, rental: updatedRental.EndRentalPeriod }
              : r
          )
        );
        alert("Rental period successfully extended!");
      } else if (response.status === 400) {
        const message = await response.text();
        alert(message); // Display the error message from the backend
      } else {
        alert("Cannot extend rental period.");
      }
    } catch (error) {
      console.error("Error extending rental:", error);
      alert("An error occurred while extending the rental period.");
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
        // sort rental by desc end date
        response.data.sort((a, b) => {
          return new Date(b.StartRentalPeriod) - new Date(a.StartRentalPeriod);
        });
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
    await payLateFee(user, updateUser);
  };

  return (
    <div className="p-8">
      <div className="mx-auto bg-white rounded-lg border-2 overflow-x-auto shadow-md max-w-screen-lg">
        <div className="p-4 bg-darkGray rounded-t-lg text-white text-center">
          <h2 className="text-xl font-bold">Account Information</h2>
        </div>
        <div className="p-4 py-3 text-left">
          <table className="w-full">
            <tbody>
              <tr>
                <td className={tableIconStyle}>
                  <FontAwesomeIcon icon={faUser} className={iconStyle} />
                </td>
                <td className="font-semibold">Name:</td>
                <td>
                  {user.FirstName} {user.LastName}
                </td>
                {/* extra empty cells for spacing purposes */}
                <td className="px-20"></td>
                <td className="px-20"></td>
                <td>
                  <ChangeUserInfo user={user} />
                </td>
              </tr>
              <tr className={tableRowInfoStyle}>
                <td className={tableIconStyle}>
                  <FontAwesomeIcon icon={faEnvelope} className={iconStyle} />
                </td>
                <td className="font-semibold">Email:</td>
                <td> {user.Email}</td>
              </tr>
              <tr className={tableRowInfoStyle}>
                <td className={tableIconStyle}>
                  <FontAwesomeIcon icon={faPhone} className={iconStyle} />
                </td>
                <td className="font-semibold">Phone:</td>
                <td>{formatPhoneNumber(user.PhoneNumber)}</td>
              </tr>
              <tr className={tableRowInfoStyle}>
                <td className={tableIconStyle}>
                  <FontAwesomeIcon icon={faCalendarAlt} className={iconStyle} />
                </td>
                <td className="font-semibold">Date joined:</td>
                <td>{getFormattedDate(user.CreatedAt)}</td>
              </tr>
              {fullUser.AccountBalance > 0 && (
                <tr className={tableRowInfoStyle}>
                  <td className={tableIconStyle}>
                    <FontAwesomeIcon icon={faBell} className={iconStyle} />
                  </td>
                  <td className="font-semibold">Late fee:</td>
                  <td>€ {fullUser.AccountBalance.toFixed(2)}</td>
                  <td>
                    <button
                      className="block bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded ml-2"
                      onClick={handlePayFee}
                    >
                      Pay fee
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          className={`mx-auto mt-8 bg-darkGray overflow-x-auto max-w-screen-lg shadow-md text-white ${
            userRentals.length === 0 ? "rounded-lg" : "border-2 rounded-lg"
          }`}
        >
          <div className="mb-4 px-5 text-center">
            <h2 className="text-xl font-bold mt-3">Your Rentals</h2>
          </div>
          {userRentals.length === 0 ? (
            <p className="mb-3">No rentals found.</p>
          ) : (
            <table className="w-full text-black">
              <thead className="text-xs uppercase bg-gray-300">
                <tr>
                  <th className="px-6 py-3">Game</th>
                  <th className="px-6 py-3">Start Date</th>
                  <th className="px-6 py-3">End Date</th>
                  <th className="px-6 py-3">Extensions Left</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {userRentals.map((rental) => {
                  var canExtend =
                    rental.EndRentalPeriod > getFormattedDate(new Date()) &&
                    rental.NumberOfExtensions < 2;
                  return (
                    <tr
                      key={rental.id}
                      className="border-t h-10 bg-gray-100 border-gray-500 hover:bg-gray-300"
                    >
                      <td className="px-6 py-4">{rental.GameName}</td>
                      <td className="px-6 py-4">
                        {getFormattedDate(rental.StartRentalPeriod)}
                      </td>
                      <td className="px-6 py-4">
                        {getFormattedDate(rental.EndRentalPeriod)}
                      </td>
                      <td
                        className={`px-6 py-4 ${
                          canExtend ? "" : "text-red-500"
                        }`}
                      >
                        {canExtend
                          ? (2 - rental.NumberOfExtensions).toString()
                          : "None"}
                      </td>
                      <td>
                        <button
                          className={`bg-green-500 hover:bg-green-700 font-bold py-1 px-3 rounded ml-2 text-white ${
                            !rental.IsDeleted && canExtend ? "" : "hidden"
                          }`}
                          onClick={() => handleExtendRental(rental)}
                        >
                          Extend Rental
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountPage;
