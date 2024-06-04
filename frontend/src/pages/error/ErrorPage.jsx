import { useRouteError, useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleGoHome = () => {
    // Navigate to the home screen
    navigate("/");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-retroblue to-darkblue text-white">
      <div className="bg-white bg-opacity-20 p-12 rounded-3xl shadow-2xl text-center backdrop-blur-md animate-fade-in">
        <FaExclamationTriangle
          size={60}
          className="text-yellow-300 mb-6 animate-bounce"
        />
        <h1 className="text-7xl font-extrabold mb-4">Oops!</h1>
        <p className="text-3xl font-semibold mb-2">{error.status || "404"}</p>
        <p className="text-xl mb-8">{error.statusText || "Page Not Found"}</p>
        <p className="text-md mb-8">
          It seems the page you are looking for does not exist or has been
          moved. Please check the URL or go back to the home page.
        </p>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-110"
          onClick={handleGoHome}
        >
          Go to Home Screen
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
