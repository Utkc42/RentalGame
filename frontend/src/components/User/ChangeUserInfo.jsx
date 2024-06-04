import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWrench } from "@fortawesome/free-solid-svg-icons";

const ChangeUserInfo = ({ user }) => {
  const iconStyle = "text-white pr-2";
  const changeLabelStyle =
    "block uppercase tracking-wide text-black text-xs font-bold mb-2";
  const inputStyle =
    "block w-full bg-gray-200 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white mb-4 text-black";

  const [seen, setSeen] = useState(false);

  function togglePop() {
    setSeen(!seen);
  }

  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formData, setFormData] = useState({
    firstName: user.FirstName,
    lastName: user.LastName,
    email: user.Email,
    phoneNumber: user.PhoneNumber,
    role: user.Role,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validatePassword(password);
    setPasswordError(error);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${user.UserId}`,
        {
          ...formData,
          password,
          phoneNumber: formData.phoneNumber.replace(" ", ""),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("User data updated.");
      togglePop();
      navigate("/auth");
    } catch (error) {
      alert("Error updating user data.");
    }
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    } else {
      return "";
    }
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    const error = validatePassword(value);
    setPassword(value);
    setPasswordError(error);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex justify-end text-white">
      <button
        onClick={togglePop}
        className="bg-darkGray hover:bg-sky-600 font-bold py-2 px-3 rounded"
      >
        <FontAwesomeIcon icon={faWrench} className={iconStyle} />
        Change Info
      </button>
      {seen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <form
            onSubmit={handleSubmit}
            className="relative top-20 m-auto gap-3 justify-center bg-white border-2 border-white rounded-lg max-w-screen-sm shadow-lg"
          >
            <div className="p-4 bg-darkGray rounded-t-lg">
              <h2 className="text-xl font-bold text-center">
                Change Account Information
              </h2>
            </div>
            <div className="p-5  rounded-b-lg">
              <div>
                <label className={changeLabelStyle} htmlFor="firstName">
                  First Name:
                </label>
                <input
                  className={inputStyle}
                  type="text"
                  name="firstName"
                  placeholder="Firstname"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className={changeLabelStyle} htmlFor="lastName">
                  Last Name:
                </label>
                <input
                  className={inputStyle}
                  type="text"
                  name="lastName"
                  placeholder="Lastname"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className={changeLabelStyle} htmlFor="email">
                  Email:
                </label>
                <input
                  className={inputStyle}
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className={changeLabelStyle} htmlFor="password">
                  Password:
                </label>
                <input
                  className={inputStyle}
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  minLength={6}
                  required
                />
                {passwordError && (
                  <p className="text-red-400 mb-3">{passwordError}</p>
                )}
              </div>
              <div>
                <label className={changeLabelStyle} htmlFor="phoneNumber">
                  Phone Number:
                </label>
                <input
                  className={inputStyle}
                  type="tel"
                  name="phoneNumber"
                  placeholder={user.PhoneNumber}
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  maxLength={13}
                  required
                />
              </div>
              <div className="flex flex-row justify-between text-white font-bold">
                <button
                  onClick={togglePop}
                  className="bg-slate-500 hover:bg-slate-700 py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <input
                  type="submit"
                  value="Submit changes"
                  className="bg-sky-600 hover:bg-sky-800 py-2 px-4 rounded"
                />
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

ChangeUserInfo.propTypes = {
  user: PropTypes.any.isRequired,
};

export default ChangeUserInfo;
