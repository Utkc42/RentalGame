import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Filter = ({ games, setFilteredGames }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    releaseYear: "",
    publisher: "",
    category: "",
  });

  useEffect(() => {
    const filteredGames = games.filter(
      (game) =>
        (!searchTerm ||
          game.Name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!filters.name || game.Name === filters.name) &&
        (!filters.releaseYear ||
          game.ReleaseYear.toString() === filters.releaseYear) &&
        (!filters.publisher || game.Publisher === filters.publisher) &&
        (!filters.category || game.Category === filters.category)
    );
    setFilteredGames(filteredGames);
  }, [games, searchTerm, filters, setFilteredGames]);

  const updateFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      name: "",
      releaseYear: "",
      publisher: "",
      category: "",
    });
    setSearchTerm("");
  };

  const closeFilters = () => {
    setShowFilterModal(false);
  };

  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center">
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border border-black text-center rounded p-2 mr-4 text-lg"
        />
        <button
          onClick={() => setShowFilterModal(true)}
          className="bg-green-500 hover:bg-green-700 font-metro text-white py-2 px-5 rounded text-2xl"
        >
          Filter
        </button>
      </div>
      {showFilterModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-100">
            <h3 className="text-2xl font-bold">Select Filters</h3>
            <div className="my-4">
              <label className="block text-lg font-medium">Name</label>
              <select
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.name}
                onChange={(e) => updateFilter("name", e.target.value)}
              >
                <option value="">Select a name</option>
                {Array.from(new Set(games.map((game) => game.Name)))
                  .sort()
                  .map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="my-4">
              <label className="block text-lg font-medium">Release Year</label>
              <select
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.releaseYear}
                onChange={(e) => updateFilter("releaseYear", e.target.value)}
              >
                <option value="">Select a year</option>
                {Array.from(new Set(games.map((game) => game.ReleaseYear)))
                  .sort((a, b) => b - a)
                  .map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
              </select>
            </div>

            <div className="my-4">
              <label className="block text-lg font-medium">Publisher</label>
              <select
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.publisher}
                onChange={(e) => updateFilter("publisher", e.target.value)}
              >
                <option value="">Select a publisher</option>
                {Array.from(new Set(games.map((game) => game.Publisher)))
                  .sort()
                  .map((publisher) => (
                    <option key={publisher} value={publisher}>
                      {publisher}
                    </option>
                  ))}
              </select>
            </div>

            <div className="my-4">
              <label className="block text-lg font-medium">Category</label>
              <select
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.category}
                onChange={(e) => updateFilter("category", e.target.value)}
              >
                <option value="">Select a category</option>
                {Array.from(new Set(games.map((game) => game.Category)))
                  .sort()
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={resetFilters}
                className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
              >
                Reset
              </button>
              <button
                onClick={closeFilters}
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Filter.propTypes = {
  games: PropTypes.array.isRequired,
  setFilteredGames: PropTypes.func.isRequired,
};

export default Filter;
