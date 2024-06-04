const initiateRentalPayment = async (paymentData, user) => {
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

    // Check if the request was successful
    if (response.ok) {
      // Payment request was successful, handle the response
      const responseData = await response.json();
      // Redirect the user to the payment URL
      window.location.href = responseData.paymentUrl;
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

export default initiateRentalPayment;
