import PropTypes from "prop-types";
import { getFormattedDate } from "../../utils/helpers";

const ReturnGameDialog = ({ returnGame, gameToReturn, setShowDialog }) => {
  const today = getFormattedDate(new Date());

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto text-white">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="relative bg-gray-900 rounded-lg max-w-md w-full">
          <button
            onClick={() => setShowDialog(false)}
            className="text-red-500 absolute top-2 right-2 hover:text-red-700 focus:outline-none"
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
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="p-6">
            <div>
              <h3 className="text-lg font-medium ">Return Game</h3>
              <div className="text-center my-3">
                Are you sure you want to return this game?
              </div>
              <div className="rounded-lg font-semibold text-left">
                <p>{gameToReturn.GameName}</p>
                <p>
                  Checked out by {gameToReturn.UserName} on{" "}
                  {getFormattedDate(gameToReturn.StartRentalPeriod)}
                </p>
                <p>
                  Expected return date:{" "}
                  {getFormattedDate(gameToReturn.EndRentalPeriod)}
                </p>
                <p>
                  Actual return date: {today}
                  <span
                    className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full ${
                      today > gameToReturn.EndRentalPeriod
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  >
                    {today > gameToReturn.EndRentalPeriod ? "Late" : "On time"}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className=" flex justify-center rounded-b-lg mb-6">
            <button
              onClick={returnGame}
              className="bg-green-500 text-white rounded-md px-4 py-2 font-semibold hover:bg-green-700"
            >
              Return Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ReturnGameDialog.propTypes = {
  returnGame: PropTypes.func.isRequired,
  gameToReturn: PropTypes.object.isRequired,
  setShowDialog: PropTypes.func.isRequired,
};

export default ReturnGameDialog;
