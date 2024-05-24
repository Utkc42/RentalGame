import PropTypes from "prop-types";
import { getFormattedDate } from "../../utils/helpers";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faCalendarAlt,
  faWrench,
  faEur,
  faBan,
} from "@fortawesome/free-solid-svg-icons";

const UserDetails = ({ setShowUserDetails, userId }) => {
  const { user } = useUser();
  const [clickedUser, setClickedUser] = useState(user);

  const labelStyle = "text-black text-sm font-semibold";
  const valueStyle = "text-black pl-2 text-bold text-base";
  const detailStyle = "my-3 flex items-center text-black";
  const iconStyle = "text-black pr-2";

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setClickedUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  });

  return (
    <div className="flex justify-end">
      <div
        onClick={() => setShowUserDetails(false)}
        className="fixed inset-0 bg-gray-500 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      >
        <div className="relative top-28 m-auto bg-white rounded-lg border-2 shadow-md max-w-screen-sm">
          <div className="p-4 bg-darkblue rounded-t-lg text-white text-center">
            <h2 className="text-2xl font-bold">User Profile</h2>
          </div>
          <div className="p-4 pt-2 text-left">
            <div className={detailStyle}>
              <FontAwesomeIcon icon={faUser} className={iconStyle} />
              <span className={labelStyle}>Name:</span>
              <span className={valueStyle}>
                {clickedUser.FirstName} {clickedUser.LastName}
              </span>
            </div>
            <div className={detailStyle}>
              <FontAwesomeIcon icon={faEnvelope} className={iconStyle} />
              <span className={labelStyle}>Email:</span>
              <span className={valueStyle}> {clickedUser.Email}</span>
            </div>
            <div className={detailStyle}>
              <FontAwesomeIcon icon={faPhone} className={iconStyle} />
              <span className={labelStyle}>Phone:</span>
              <span className={valueStyle}>
                {formatPhoneNumber(clickedUser.PhoneNumber)}
              </span>
            </div>
            <div className={detailStyle}>
              <FontAwesomeIcon icon={faCalendarAlt} className={iconStyle} />
              <span className={labelStyle}>Date joined:</span>
              <span className={valueStyle}>
                {getFormattedDate(clickedUser.CreatedAt)}
              </span>
            </div>
            <div className={detailStyle}>
              <FontAwesomeIcon icon={faWrench} className={iconStyle} />
              <span className={labelStyle}>Date updated:</span>
              <span className={valueStyle}>
                {getFormattedDate(clickedUser.UpdatedAt)}
              </span>
            </div>
            <div className={detailStyle}>
              <FontAwesomeIcon icon={faEur} className={iconStyle} />
              <span className={labelStyle}>Balance:</span>
              <span className={valueStyle}>{clickedUser.AccountBalance}</span>
            </div>
            <div className={detailStyle}>
              <FontAwesomeIcon icon={faBan} className={iconStyle} />
              <span className={labelStyle}>Late return count:</span>
              <span className={valueStyle}>{clickedUser.LateReturnCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UserDetails.propTypes = {
  setShowUserDetails: PropTypes.any.isRequired,
  userId: PropTypes.any.isRequired,
};

export default UserDetails;
