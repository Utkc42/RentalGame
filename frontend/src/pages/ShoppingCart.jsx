import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import noImage from "../assets/no_image_available.svg";
import { getFormattedDate, getFutureDate } from "../utils/helpers";
import payLateFee from "../api/PayLateFee";
import initiateRentalPayment from "../api/PayRental";

const ShoppingCart = () => {
  const { cartItems, setCartItems } = useCart();
  const [lateFee, setLateFee] = useState(0);
  const { user, updateUser } = useUser();
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    try {
      const storedCartItems = JSON.parse(
        localStorage.getItem(`cartItems-${user.UserId}`)
      );
      if (storedCartItems) {
        setCartItems(storedCartItems);
      }
    } catch (error) {
      console.error("Error parsing cart items from local storage:", error);
    }
  }, [setCartItems, user.UserId]);

  useEffect(() => {
    localStorage.setItem(`cartItems-${user.UserId}`, JSON.stringify(cartItems));
    setIsEmpty(cartItems.length === 0);
  }, [cartItems, user.UserId]);

  useEffect(() => {
    if (user) {
      setLateFee(user.AccountBalance);
    }
  }, [user]);

  const handleRemoveItem = (gameId) => {
    const shouldRemove = window.confirm(
      "Are you sure you want to remove this item from your cart?"
    );
    if (shouldRemove) {
      const updatedCartItems = cartItems.filter(
        (item) => item.GameId !== gameId
      );
      setCartItems(updatedCartItems);
    }
  };

  const handleClearCart = () => {
    const shouldClear = window.confirm(
      "Are you sure you want to clear your entire cart?"
    );
    if (shouldClear) {
      setCartItems([]);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems
      .reduce(
        (total, item) => total + item.RentalPricePerWeek * item.quantity,
        0
      )
      .toFixed(2);
  };

  const handleCheckOutClick = async () => {
    const paymentData = gatherPaymentData();
    await initiateRentalPayment(paymentData, user);
    await sendRentalData();
    setCartItems([]);
  };

  const handlePayFee = async () => {
    await payLateFee(user, updateUser);
  };

  const gatherPaymentData = () => {
    // Gather payment data from the user interface
    const paymentData = {
      amountInCents: calculateTotalPrice() * 100,
      currencyCode: "EUR",
      description: `RetroRental Rental - user id ${user.UserId}`,
      firstName: `${user.FirstName}`,
      lastName: `${user.LastName}`,
      country: "BE",
      locale: "EN",
      email: `${user.Email}`,
    };
    return paymentData;
  };

  const sendRentalData = async () => {
    try {
      // Iterate over each game in the cart
      cartItems.forEach(async (game) => {
        const requestBody = {
          userId: user.UserId,
          gameId: game.GameId,
          startRentalPeriod: getFormattedDate(),
          endRentalPeriod: getFormattedDate(getFutureDate(7)),
          numberOfExtensions: 0,
          rentalPrice: game.RentalPricePerWeek,
          isDeleted: false,
        };

        // Make an HTTP POST request to your backend for each game
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rentals`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(requestBody), // Convert the body object to JSON
        });
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="bg-gray-800 px-2 max-w-2xl mx-auto text-white rounded-lg shadow overflow-hidden">
        <h2 className="text-center text-2xl font-bold p-4">Your Cart</h2>
        {isEmpty ? (
          <p className="pb-4">
            Your cart is currently empty. Add games to proceed with the
            checkout.
          </p>
        ) : (
          <div>
            <table className="w-full">
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.GameId}>
                    <td className="px-4 py-2 flex items-center">
                      <img
                        src={item.CoverImage || noImage}
                        alt={item.Name}
                        className="w-12 h-12 object-contain rounded mr-4"
                      />
                      <p>{item.Name}</p>
                    </td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">
                      € {(item.RentalPricePerWeek * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => handleRemoveItem(item.GameId)}
                        className="text-red-500"
                        aria-label={`Remove ${item.Name} from cart`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr className="text-white mx-4" />
            <div className="p-4">
              <p className="text-lg text-right">
                Total: € {calculateTotalPrice()}
              </p>
              <div className="flex justify-end pt-4 pb-2">
                <button
                  onClick={() => handleClearCart()}
                  className="bg-red-500 text-white hover:bg-red-700 font-bold py-2 px-4 rounded mr-4"
                  aria-label="Clear cart"
                >
                  Clear Cart
                </button>
                {!user && (
                  <button
                    className="bg-green-500 text-white hover:bg-green-700 font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed"
                    disabled
                    aria-label="Please log in to proceed with checkout"
                  >
                    Check-Out
                  </button>
                )}
                {user && (
                  <button
                    onClick={handleCheckOutClick}
                    className={`bg-green-500 text-white hover:bg-green-700 font-bold py-2 px-4 rounded ${
                      lateFee !== 0
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                    disabled={lateFee !== 0}
                    aria-label="Proceed with checkout"
                  >
                    Check-Out
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {user && lateFee !== 0 && (
        <div className="text-center mt-4">
          <p className="text-red-500 mb-4">
            You have a late fee of € {lateFee.toFixed(2)}. You need to pay this
            fee before you can rent new games.
          </p>
          <button
            className="bg-green-500 text-white hover:bg-green-700 font-bold py-2 px-4 rounded"
            onClick={handlePayFee}
          >
            Pay Fee
          </button>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
