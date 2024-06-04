import { useState } from "react";
import PropTypes from "prop-types";

const AdminDashboardFilter = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    const { value } = e.target;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded text-black"
      />
    </div>
  );
};

AdminDashboardFilter.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default AdminDashboardFilter;
