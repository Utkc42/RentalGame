import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div className="flex justify-center">
      <div className="bg-gray-800 text-white m-4 p-4 w-1/2 rounded-lg">
        <h1 className="text-xl font-semibold mb-4">Payment Successful</h1>
        <p>Thank you!</p>
        <p>Your payment has been successfully processed.</p>
        <div className="mt-8 mb-3">
          <p>
            <Link
              className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded text-sm"
              to="/"
            >
              Back to homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
