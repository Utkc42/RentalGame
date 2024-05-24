import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useUser } from "./UserContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = user
      ? localStorage.getItem(`cartItems-${user.UserId}`)
      : null;
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Update the cart items in local storage when the user changes
  useEffect(() => {
    if (user) {
      const storedCart = localStorage.getItem(`cartItems-${user.UserId}`);
      setCartItems(storedCart ? JSON.parse(storedCart) : []);
    }
  }, [user]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const isItemInCart = prevItems.find((i) => i.GameId === item.GameId);
      if (isItemInCart) {
        return prevItems.map((i) =>
          i.GameId === item.GameId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `cartItems-${user.UserId}`,
        JSON.stringify(cartItems)
      );
    }
  }, [cartItems, user]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartContext;
