import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpForm = ({ toggleForm }) => {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+32");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    Role: "User",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordError = validatePassword(password);
    setPasswordError(passwordError);

    const phoneNumberError = validatePhoneNumber(phoneNumber);
    setPhoneNumberError(phoneNumberError);

    if (phoneNumberError || passwordError) {
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        {
          ...formData,
          password,
          phoneNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate("/auth");
        toggleForm();
      }, 2000);
    } catch (error) {
      // Extract error message from response and set it to error state
      if (error.response && error.response.status === 409) {
        setError(error.response.data); // Assuming the error message is in error.response.data
      } else {
        setError("An error occurred during registration. Please try again.");
      }
    }
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    } else {
      return "";
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    setPhoneNumber(phoneNumber.replace(" ", ""));
    const phoneNumberRegex = /^\+32\d{9}$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
      return "Phone number must be in the format +32XXXXXXXXX";
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

  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;
    setPhoneNumber(value);
  };

  const handlePhoneNumberBlur = () => {
    const error = validatePhoneNumber(phoneNumber);
    setPhoneNumberError(error);
  };

  return (
    <div className="flex flex-col items-center">
      {showSuccessMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg text-sm mt-4 z-50">
          User registered successfully!
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-4 justify-center"
      >
        <h2 className="text-darkblue text-3xl font-bold text-center mb-6">
          Register
        </h2>
        <div>
          <label
            className="block uppercase text-left tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="firstName"
          >
            First Name
          </label>
          <input
            className="appearance-none block w-full bg-gray-100 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 mb-4"
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label
            className="block uppercase text-left tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <input
            className="appearance-none block w-full bg-gray-100 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 mb-4"
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label
            className="block uppercase text-left tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="appearance-none block w-full bg-gray-100 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 mb-4"
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label
            className="block uppercase text-left tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="appearance-none block w-full bg-gray-100 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 mb-4"
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
          <label
            className="block uppercase text-left tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="phoneNumber"
          >
            Phone Number
          </label>
          <input
            className="appearance-none block w-full bg-gray-100 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 mb-4"
            type="tel"
            name="phoneNumber"
            placeholder="+32 XXX XXX XXX"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            onBlur={handlePhoneNumberBlur}
            maxLength={13}
            required
          />
          {phoneNumberError && (
            <p className="text-red-400 mb-3">{phoneNumberError}</p>
          )}
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <input
          type="submit"
          value="Register"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        />
        <button
          type="button"
          className="mt-2 text-darkblue hover:text-blue-800 underline"
          onClick={toggleForm}
        >
          Already have an account? Login here
        </button>
      </form>
    </div>
  );
};

SignUpForm.propTypes = {
  toggleForm: PropTypes.func.isRequired,
};

export default SignUpForm;
