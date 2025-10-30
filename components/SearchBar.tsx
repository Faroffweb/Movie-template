
import React, { useState } from 'react';
import { SearchIcon } from './icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2">
      <div className="relative flex-grow">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="w-5 h-5 text-gray-500" />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ..."
          className="w-full bg-[#2a2a2a] border border-gray-600 text-white rounded-md pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-shadow"
        />
      </div>
      <button
        type="submit"
        className="bg-yellow-500 text-black font-bold text-sm sm:text-base px-4 py-3 sm:px-6 rounded-md hover:bg-yellow-600 transition-colors duration-200"
      >
        Search
      </button>
    </form>
  );
};
