import { Link } from "react-router-dom";

const FailurePage = () => {
  return (
    <div className="flex justify-center">
      <div className="bg-gray-800 text-white m-4 p-4 w-1/2 rounded-lg">
        <h1 className="text-xl font-semibold mb-4">Payment failed</h1>
        <p>Oops!</p>
        <p>
          It looks like something went wrong. Please retry your payment or
          contact support for assistance.
        </p>
        <div className="mt-8 mb-3">
          <p>
            <Link
              className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded text-sm"
              to="/shopping-cart"
            >
              Retry Payment
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FailurePage;
