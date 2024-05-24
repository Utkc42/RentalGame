import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import noImage from "../assets/no_image_available.svg";
import { getFormattedDate, getFutureDate } from "../utils/helpers";

const ShoppingCart = () => {
  const { cartItems, setCartItems } = useCart();
  const itemRefs = useRef([]);
  const { user } = useUser();
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

  const handleCheckOutClick = () => {
    const paymentData = gatherPaymentData();
    initiatePayment(paymentData);
  };

  const gatherPaymentData = () => {
    // Gather payment data from the user interface
    const paymentData = {
      amountInCents: calculateTotalPrice() * 100,
      currencyCode: "EUR",
      description: `RetroRental Order - user id ${user.UserId}`,
      firstName: `${user.FirstName}`,
      lastName: `${user.LastName}`,
      country: "BE",
      locale: "EN",
      email: `${user.Email}`,
    };
    console.log("Payment data:", JSON.stringify(paymentData));
    return paymentData;
  };

  const initiatePayment = async (paymentData) => {
    try {
      // Send the payment request to the backend
      const paymentUrl = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/payments/process`;
      const response = await fetch(paymentUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(paymentData),
      });

      console.log("Response:", response);

      // Check if the request was successful
      if (response.ok) {
        // Payment request was successful, handle the response
        const responseData = await response.json();
        // Redirect the user to the payment URL
        window.location.href = responseData.paymentUrl;
        sendRentalData();
        setCartItems([]);
      } else {
        // Payment request failed, handle the error
        console.error("Payment failed:", response.statusText);
        // Display an error message to the user
        alert("Payment failed. Please try again later.");
      }
    } catch (error) {
      // An error occurred while sending the payment request
      console.error("An error occurred:", error);
      // Display an error message to the user
      alert("An error occurred. Please try again later.");
    }
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

        console.log("Request body:", requestBody);

        // Make an HTTP POST request to your backend for each game
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/rentals`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(requestBody), // Convert the body object to JSON
          }
        );

        // Log the response status
        console.log("Response status:", response.status);

        // Log the response body
        const responseBody = await response.text();
        console.log("Response body:", responseBody);

        if (response.ok) {
          // Payment successful for this game
          console.log(`Payment successful for game ID ${game.GameId}`);
        } else {
          // Payment failed for this game, handle error
          console.error(`Payment failed for game ID ${game.GameId}`);
        }
      });
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle error
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="bg-gray-800 px-2 max-w-2xl mx-auto text-white rounded-lg shadow overflow-hidden">
        {cartItems.map((item) => (
          <div
            key={item.GameId}
            ref={(element) => (itemRefs.current[item.GameId] = element)}
            className="flex items-center justify-between p-4 border-b border-gray-200"
          >
            <div className="flex items-center">
              <img
                src={item.CoverImage || noImage}
                alt={item.Name}
                className="w-20 h-20 object-contain rounded mr-4"
              />
              <div>
                <p className="text-lg">{item.Name}</p>
              </div>
            </div>{" "}
            <p className="mr-2">Quantity: {item.quantity}</p>
            <p>€ {(item.RentalPricePerWeek * item.quantity).toFixed(2)}</p>
            <div className="flex items-center">
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
            </div>
          </div>
        ))}
        {isEmpty && (
          <div className="text-center py-4">
            <p>
              Your shopping cart is empty. Add items to proceed with checkout.
            </p>
          </div>
        )}
        {!isEmpty && (
          <div className="p-4">
            <p className="text-lg text-right">
              Total: €{calculateTotalPrice()}
            </p>
            <div className="flex justify-end">
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
                  className="bg-green-500 text-white hover:bg-green-700 font-bold py-2 px-4 rounded"
                  aria-label="Proceed with checkout"
                >
                  Check-Out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
