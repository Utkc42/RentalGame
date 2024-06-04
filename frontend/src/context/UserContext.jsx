import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData, token) => {
    setUser({ ...userData, token });
    sessionStorage.setItem("user", JSON.stringify({ ...userData, token }));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    sessionStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
