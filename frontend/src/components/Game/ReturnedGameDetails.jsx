import PropTypes from "prop-types";

const ReturnedGameDetails = ({
  gameCopyDetails,
  setGameCopyDetails,
  handleCheckInClick,
}) => {
  const handleCancelClick = () => {
    // Clear useState and form
    setGameCopyDetails(null);
  };

  console.log("Game copy details: ", gameCopyDetails);
  return gameCopyDetails.isDeleted ? (
    <div className="mt-4 w-1/2 gap-4 flex flex-col justify-center">
      <p className="text-white font-semibold text-center mb-4">
        No rental with this game ID could be found
      </p>
    </div>
  ) : (
    <div className="m-4 w-1/2 gap-4 flex flex-col justify-center bg-gray-800 p-4 rounded-lg">
      <h2 className="text-white text-2xl font-bold text-center mb-4">
        Please verify details
      </h2>
      <div className="bg-gray-800 rounded-lg">
        <p className="text-white font-semibold">
          Game ID: {gameCopyDetails.gameId}
        </p>
        <p className="text-white font-semibold">
          Game: {gameCopyDetails.gameTitle}
        </p>
        <p className="text-white font-semibold">
          Checked out by {gameCopyDetails.checkedOutByUser} on{" "}
          {gameCopyDetails.checkedOutDate}
        </p>
        <p className="text-white font-semibold">
          Expected return date: {gameCopyDetails.expectedReturnDate}
        </p>
        <p className="text-white font-semibold">
          Actual return date: {gameCopyDetails.actualReturnDate}
          <span
            className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full ${
              gameCopyDetails.actualReturnDate >
              gameCopyDetails.expectedReturnDate
                ? "bg-red-500"
                : "bg-green-500"
            }`}
          >
            {gameCopyDetails.actualReturnDate >
            gameCopyDetails.expectedReturnDate
              ? "Late"
              : "On time"}
          </span>
        </p>
      </div>
      <div className="flex justify-center">
        <div className="flex">
          <button
            onClick={handleCancelClick}
            className="block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-auto mt-4"
          >
            Cancel
          </button>
          <button
            onClick={handleCheckInClick}
            className="block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-auto ml-6 mt-4"
          >
            Check-In Game
          </button>
        </div>
      </div>
    </div>
  );
};

ReturnedGameDetails.propTypes = {
  gameCopyDetails: PropTypes.shape({
    gameCopyId: PropTypes.string,
    gameId: PropTypes.string,
    gameTitle: PropTypes.string,
    checkedOutByUser: PropTypes.string,
    checkedOutDate: PropTypes.string,
    expectedReturnDate: PropTypes.string,
    actualReturnDate: PropTypes.string,
    isDeleted: PropTypes.bool,
  }).isRequired,
  setGameCopyDetails: PropTypes.func.isRequired,
  handleCheckInClick: PropTypes.func.isRequired,
};

export default ReturnedGameDetails;
