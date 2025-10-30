
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPrev, onNext }) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-4 mt-8">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="flex items-center justify-center px-4 py-2 bg-[#1a1a1a] border border-gray-700 text-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
        aria-label="Go to previous page"
      >
        <ChevronLeftIcon className="w-5 h-5 mr-2" />
        <span>Previous</span>
      </button>

      <span className="text-gray-400 font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center px-4 py-2 bg-[#1a1a1a] border border-gray-700 text-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
        aria-label="Go to next page"
      >
        <span>Next</span>
        <ChevronRightIcon className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
};
