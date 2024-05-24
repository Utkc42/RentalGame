import { useState } from "react";
import LoginForm from "../components/AuthForms/LoginForm";
import RegisterForm from "../components/AuthForms/SignUpForm";

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-darkblue to-retroblue">
      <div className="relative w-full max-w-4xl p-8 bg-white rounded-lg shadow-2xl overflow-hidden">
        <div
          className="form-container flex"
          style={{
            transform: showLogin ? "translateX(0)" : "translateX(-1%)",
            transition: "transform 0.5s ease-in-out",
          }}
        >
          <div
            className="w-full p-6"
            style={{ display: showLogin ? "block" : "none" }}
          >
            <LoginForm toggleForm={toggleForm} />
          </div>
          <div
            className="w-full p-6"
            style={{ display: showLogin ? "none" : "block" }}
          >
            <RegisterForm toggleForm={toggleForm} />
          </div>
        </div>
        <div className="absolute bottom-4 right-4 text-white">
          {showLogin ? (
            <p>
              Dont have an account?{" "}
              <button className="underline" onClick={toggleForm}>
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button className="underline" onClick={toggleForm}>
                Login here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
