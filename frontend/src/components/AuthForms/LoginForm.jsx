import PropTypes from "prop-types";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ toggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginUrl = `${import.meta.env.VITE_BACKEND_URL}/api/users/login`;
    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      const data = await response.json();
      const { User, AuthResponse } = data;
      const { Token } = AuthResponse;

      login(User, Token);
      navigate("/");
    } catch (error) {
      setError("Error logging in. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleLogin}
        className="w-full flex flex-col gap-4 justify-center"
      >
        <h2 className="text-darkblue text-3xl font-bold text-center mb-6">
          Login
        </h2>
        <div>
          <label
            className="block uppercase tracking-wide text-gray-700 text-left text-xs font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="appearance-none block w-full bg-gray-100 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 mb-4"
            type="text"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label
            className="block uppercase  text-left tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="appearance-none block w-full bg-gray-100 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 mb-4"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <input
          type="submit"
          value="Login"
          className="block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        />
        <button
          type="button"
          className="mt-2 text-darkblue hover:text-retroblue underline"
          onClick={toggleForm}
        >
          Do not have an account? Register here
        </button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  toggleForm: PropTypes.func.isRequired,
};

export default LoginForm;
