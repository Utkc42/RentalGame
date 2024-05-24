import { Link } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import winkelkarZwart from "../assets/winkelkar.png";
import winkelkarRood from "../assets/winkelkar_rood.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const [hovered, setHovered] = useState(false);
  const { user, logout } = useUser();
  let decodedToken;
  if (user) {
    decodedToken = jwtDecode(user.token);
  }

  const handleLogout = () => {
    logout();
    window.location.href = "/"; // Redirect to home page after logout
  };

  const [seen, setSeen] = useState(false);

  function togglePop() {
    setSeen(!seen);
  }

  function Icon() {
    return (
      <div className="absolute top-full right-0 mt-2 flex flex-col justify-center items-center z-40">
        <div className=" p-3 rounded-2xl shadow-md text-white w-48 bg-slate-700 border-2 border-slate-400">
          <p className="text-base my-2 font-bold">
            {user.FirstName} {user.LastName}
          </p>
          <p className="text-sm my-2">
            {user.Email.length > 20
              ? `${user.Email.slice(0, 20)}...`
              : user.Email}
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-retro py-2 px-4 rounded text-sm my-2"
          >
            <span>
              Logout <FontAwesomeIcon icon={faSignOutAlt} />
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="text-darkblue bg-white top-0 left-0 right-0 p-2 z-50 text-xl relative h-22">
        <div className="flex items-center justify-center">
          <nav className="mx-auto space-x-12 px text-2xl font-retro flex flex-wrap items-center justify-center">
            {user ? (
              <Link to="/" className="hover:text-retroLightRed">
                Home
              </Link>
            ) : (
              <Link to="/" className="hover:text-retroLightRed ml-48">
                Home
              </Link>
            )}

            {user && decodedToken.role.toLowerCase() === "admin" && (
              <Link to="/admin/dashboard" className="hover:text-retroLightRed">
                Dashboard
              </Link>
            )}

            {user && (
              <Link to="/account" className="hover:text-retroLightRed">
                Account
              </Link>
            )}

            <Link
              to={user ? "/shopping-cart" : "/auth"} // Redirect to auth if not logged in
              className="hover:text-retroLightRed"
              style={{ color: "white" }} // Force white color
            >
              <img
                src={hovered ? winkelkarRood : winkelkarZwart}
                alt="shopping cart"
                className="h-12 hover:filter"
                onMouseOver={() => setHovered(true)}
                onMouseOut={() => setHovered(false)}
              />
            </Link>
          </nav>
          <div className="flex items-center justify-center">
            {!user && (
              <div>
                <Link
                  to="/auth"
                  className="bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 hover:bg-gradient-to-r hover:from-yellow-600 hover:via-red-600 hover:to-pink-600 text-white font-retro font-bold py-2 px-4 rounded text-xl mr-3"
                >
                  Login
                </Link>
              </div>
            )}
            {user && (
              <div className="absolute right-5">
                <button
                  onClick={togglePop}
                  className="bg-neonGreen hover:bg-green-700 text-white font-retro py-2 px-4 rounded text-sm mr-3"
                >
                  {user.FirstName} {user.LastName[0]}.
                </button>
                {seen ? <Icon /> : null}
              </div>
            )}
          </div>
        </div>
      </header>
      <hr className="border border-white w-full mt-1" />
    </div>
  );
};

export default Header;
