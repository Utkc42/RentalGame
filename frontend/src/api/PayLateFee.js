const payLateFee = async (user, updateUser) => {
  try {
    // Prepare payment data
    const paymentData = {
      amountInCents: (user.AccountBalance * 100).toFixed(0),
      currencyCode: "EUR",
      description: `RetroRental Late Fee - user id ${user.UserId}`,
      firstName: `${user.FirstName}`,
      lastName: `${user.LastName}`,
      country: "BE",
      locale: "EN",
      email: `${user.Email}`,
    };

    // Make payment request
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/payments/process`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(paymentData),
      }
    );

    // Handle payment response
    if (response.ok) {
      const responseData = await response.json();
      // Redirect to payment URL
      window.location.href = responseData.paymentUrl;
      // Update user data after successful payment
      updateUser({ ...user, AccountBalance: 0 });
      // Update user data in the backend
      await updateUserAccountBalance(user);
    } else {
      console.error("Payment failed:", response.statusText);
      alert("Payment failed. Please try again later.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    alert("An error occurred. Please try again later.");
  }
};

const updateUserAccountBalance = async (user) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${
        user.UserId
      }/account-balance`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    if (response.ok) {
      await response.json();
    } else {
      console.error("User data update failed:", response.statusText);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

export default payLateFee;
