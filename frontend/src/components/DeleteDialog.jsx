import PropTypes from "prop-types";

const DeleteDialog = ({ setShowDeleteDialog, handleDelete }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 shadow-lg w-80">
        <h2 className="text-slate-700 text-xl font-semibold mb-4">
          Delete User
        </h2>
        <p className="text-slate-700 text-left mb-4">
          Are you sure you want to delete this user?
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => setShowDeleteDialog(false)}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-3"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteDialog.propTypes = {
  setShowDeleteDialog: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default DeleteDialog;
